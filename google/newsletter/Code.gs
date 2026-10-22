/* Paste into Google Apps Script. Setup instructions: google/newsletter/README.md. */
var SUBSCRIBER_HEADERS = ['email', 'status', 'token', 'requestedAt', 'confirmationSentAt'];
var DELIVERY_HEADERS = ['key', 'email', 'issueId', 'title', 'pdfUrl', 'status', 'updatedAt'];

function properties_() { return PropertiesService.getScriptProperties(); }
function required_(key) {
  var value = properties_().getProperty(key);
  if (!value) throw new Error('Missing Script Property: ' + key);
  return value;
}
function sheet_(name, headers) {
  var book = SpreadsheetApp.openById(required_('SPREADSHEET_ID'));
  var sheet = book.getSheetByName(name);
  if (!sheet) { sheet = book.insertSheet(name); sheet.appendRow(headers); sheet.setFrozenRows(1); }
  return sheet;
}
function rows_(sheet) { return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues() : []; }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function token_() { return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''); }
function escape_(text) { return String(text).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function page_(message) { return HtmlService.createHtmlOutput('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>StatSoc newsletter</title></head><body style="font:16px system-ui;max-width:36rem;margin:4rem auto;padding:1rem"><h1>StatSoc newsletter</h1><p>' + escape_(message) + '</p></body></html>'); }
function link_(action, token) { return required_('WEB_APP_URL') + '?action=' + action + '&token=' + encodeURIComponent(token); }
function validToken_(value) { return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value); }

// GET only shows a form: email security scanners cannot subscribe/unsubscribe someone by opening a link.
function doGet(e) {
  var action = e.parameter.action;
  var token = e.parameter.token;
  if ((action !== 'confirm' && action !== 'unsubscribe') || !validToken_(token)) return page_('This link is invalid. Please use the link in your newsletter email.');
  var label = action === 'confirm' ? 'Confirm subscription' : 'Unsubscribe';
  return HtmlService.createHtmlOutput('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>StatSoc newsletter</title></head><body style="font:16px system-ui;max-width:36rem;margin:4rem auto;padding:1rem"><h1>' + label + '</h1><p>' + (action === 'confirm' ? 'Confirm that you want to receive StatSoc newsletter emails.' : 'Stop receiving StatSoc newsletter emails.') + '</p><form method="post" target="_top" action="' + escape_(required_('WEB_APP_URL')) + '"><input type="hidden" name="action" value="' + action + '"><input type="hidden" name="token" value="' + token + '"><button type="submit" style="padding:12px 20px">' + label + '</button></form></body></html>');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ accepted: false });
  try {
    var subscribers = sheet_('Subscribers', SUBSCRIBER_HEADERS);
    var data = rows_(subscribers);
    if (e.parameter && (e.parameter.action === 'confirm' || e.parameter.action === 'unsubscribe')) {
      var action = e.parameter.action, token = e.parameter.token;
      if (!validToken_(token)) return page_('This link is invalid.');
      var index = data.findIndex(function(row) { return row[2] === token; });
      if (index < 0) return page_('This link is no longer valid. Please subscribe again on the website.');
      var row = data[index];
      if (action === 'unsubscribe') {
        subscribers.getRange(index + 2, 2).setValue('unsubscribed');
        return page_('You have been unsubscribed. You will receive no further newsletter emails.');
      }
      if (row[1] === 'confirmed') return page_('Your subscription is already confirmed.');
      if (row[1] !== 'pending' || Date.now() - new Date(row[3]).getTime() > 7 * 86400000) return page_('This confirmation has expired. Please subscribe again on the website.');
      subscribers.getRange(index + 2, 2).setValue('confirmed');
      return page_('Your subscription is confirmed. The latest published edition will be emailed when the delivery queue next runs.');
    }
    var input;
    try { input = JSON.parse(e.postData.contents); } catch (_) { return json_({ accepted: false }); }
    if (input.secret !== required_('SHARED_SECRET') || input.consent !== true) return json_({ accepted: false });
    var email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[a-z0-9][^\s<>@]*@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return json_({ accepted: false });
    var existing = data.findIndex(function(row) { return row[0] === email; });
    if (existing >= 0 && (data[existing][1] === 'confirmed' || (data[existing][1] === 'pending' && Date.now() - new Date(data[existing][3]).getTime() < 7 * 86400000))) return json_({ accepted: true });
    // Bound new requests to keep abusive submissions from growing the sheet indefinitely.
    var recent = data.filter(function(row) { return Date.now() - new Date(row[3]).getTime() < 86400000; }).length;
    if (recent >= 50) return json_({ accepted: false });
    var newRow = [email, 'pending', token_(), new Date(), ''];
    if (existing < 0) subscribers.appendRow(newRow);
    else subscribers.getRange(existing + 2, 1, 1, newRow.length).setValues([newRow]);
    // Send only the new signup's confirmation while the signup lock is held.
    try { sendConfirmation_(subscribers, rows_(subscribers), existing < 0 ? subscribers.getLastRow() - 2 : existing); }
    catch (_) { console.warn('Confirmation send failed; inspect confirmationSentAt before retrying.'); }
    return json_({ accepted: true });
  } finally { lock.releaseLock(); }
}


// Shared by signup and the scheduled queue; caller holds the script lock.
function sendConfirmation_(subscribers, people, index) {
  var pending = people[index];
  if (!pending || pending[1] !== 'pending' || pending[4] || Date.now() - new Date(pending[3]).getTime() > 7 * 86400000) return;
  var sentRecently = people.filter(function(row) { return row[4] && Date.now() - new Date(row[4]).getTime() < 86400000; }).length;
  if (sentRecently >= 20 || MailApp.getRemainingDailyQuota() < 1) return;
  var confirmation = link_('confirm', pending[2]);
  // Persist before sending so timeout/retry cannot duplicate the confirmation.
  pending[4] = new Date();
  subscribers.getRange(index + 2, 5).setValue(pending[4]);
  SpreadsheetApp.flush();
  MailApp.sendEmail({ to: pending[0], subject: 'Confirm your StatSoc newsletter subscription', name: 'StatSoc', replyTo: 'statsoc.sydney@gmail.com', body: 'Confirm your subscription: ' + confirmation + '\n\nThis link expires seven days after signup. If you did not request this, ignore this email; you will not receive newsletters.' });
}

function latestIssue_() {
  var site = required_('SITE_URL').replace(/\/$/, '');
  if (!/^https:\/\/[^/]+$/.test(site)) throw new Error('SITE_URL must be an HTTPS origin without a path');
  var response = UrlFetchApp.fetch(site + '/content/newsletter.json', { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) throw new Error('Published newsletter feed unavailable');
  var feed = JSON.parse(response.getContentText());
  var issue = feed.archive.issues[0];
  if (!issue || !issue.href) return null;
  // Only serve uploaded PDFs on the configured society site, never arbitrary links.
  var href = issue.href;
  if (href.indexOf(site + '/') === 0) href = href.slice(site.length);
  if (!/^\/uploads\/newsletters\/[a-z0-9_./% -]+\.pdf$/i.test(href) || /\.\.|%2e|%2f|%5c/i.test(href)) throw new Error('Upload the PDF under /uploads/newsletters/');
  if (!/^[a-z0-9_-]{1,100}$/i.test(issue.id)) throw new Error('Issue ID must be unique and URL-safe');
  // Do not queue an HTML fallback or a missing upload as a newsletter.
  var pdf = UrlFetchApp.fetch(site + href.replace(/ /g, '%20'), { muteHttpExceptions: true });
  if (pdf.getResponseCode() !== 200 || pdf.getContentText().slice(0, 5) !== '%PDF-') throw new Error('Published file is not a PDF');
  return { id: issue.id, title: String(issue.title).replace(/[\r\n]/g, ' ').slice(0, 180), url: site + href.replace(/ /g, '%20') };
}

// Run automatically every 15 minutes. Also safe to run manually after publishing.
function processNewsletterQueue() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  var started = Date.now();
  try {
    var subscribers = sheet_('Subscribers', SUBSCRIBER_HEADERS);
    var deliveries = sheet_('Deliveries', DELIVERY_HEADERS);
    var people = rows_(subscribers), jobs = rows_(deliveries);
    var issue = null;
    try { issue = latestIssue_(); } catch (_) { console.warn("Could not read a valid published PDF; existing queues and confirmations will still be processed."); }
    var keys = new Set(jobs.map(function(row) { return row[0]; }));
    if (issue) people.forEach(function(person) {
      var key = issue.id + ':' + person[0];
      if (person[1] === 'confirmed' && !keys.has(key)) {
        var job = [key, person[0], issue.id, issue.title, issue.url, 'queued', new Date()];
        deliveries.appendRow(job); jobs.push(job); keys.add(key);
      }
    });
    var byEmail = {};
    people.forEach(function(person) { byEmail[person[0]] = person; });
    for (var i = 0; i < jobs.length; i++) {
      if (Date.now() - started > 240000 || MailApp.getRemainingDailyQuota() < 1) break;
      var job = jobs[i], person = byEmail[job[1]];
      if (job[5] !== 'queued') continue;
      if (!person || person[1] !== 'confirmed') {
        deliveries.getRange(i + 2, 6).setValue('cancelled'); continue;
      }
      // Persist before sending. Interrupted/ambiguous sends require review rather than risking duplicate mail.
      deliveries.getRange(i + 2, 6, 1, 2).setValues([['sending', new Date()]]);
      SpreadsheetApp.flush();
      try {
        var unsubscribe = link_('unsubscribe', person[2]);
        MailApp.sendEmail({ to: person[0], subject: 'StatSoc newsletter: ' + job[3], name: 'StatSoc', replyTo: 'statsoc.sydney@gmail.com',
          body: 'Your StatSoc newsletter is ready: ' + job[3] + '\n\nRead or download the PDF: ' + job[4] + '\n\nUnsubscribe: ' + unsubscribe,
          htmlBody: '<h2>' + escape_(job[3]) + '</h2><p>Your latest StatSoc newsletter is ready.</p><p><a href="' + escape_(job[4]) + '">Read / download the newsletter PDF</a></p><p><a href="' + escape_(unsubscribe) + '">Unsubscribe</a></p>' });
        deliveries.getRange(i + 2, 6, 1, 2).setValues([['sent', new Date()]]);
      } catch (_) { deliveries.getRange(i + 2, 6).setValue('review'); }
    }
    for (var n = 0; n < people.length; n++) {
      if (MailApp.getRemainingDailyQuota() < 1 || Date.now() - started > 240000) break;
      sendConfirmation_(subscribers, people, n);
    }
  } finally { lock.releaseLock(); }
}

function setupNewsletter() {
  ['SPREADSHEET_ID', 'SHARED_SECRET', 'WEB_APP_URL', 'SITE_URL'].forEach(required_);
  sheet_('Subscribers', SUBSCRIBER_HEADERS); sheet_('Deliveries', DELIVERY_HEADERS);
  ScriptApp.getProjectTriggers().filter(function(trigger) { return trigger.getHandlerFunction() === 'processNewsletterQueue'; }).forEach(function(trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger('processNewsletterQueue').timeBased().everyMinutes(15).create();
}
