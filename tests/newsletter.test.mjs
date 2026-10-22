import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import subscribe from '../netlify/functions/newsletter-subscribe.mjs';

function googleHarness() {
  const sheets = new Map(), sent = [];
  let quota = 100;
  const properties = { SPREADSHEET_ID: 'test', SHARED_SECRET: 'secret', WEB_APP_URL: 'https://script.google.com/macros/s/test/exec', SITE_URL: 'https://example.com' };
  const book = {
    getSheetByName: name => sheets.get(name),
    insertSheet(name) {
      const data = [];
      const sheet = {
        data, appendRow: row => data.push([...row]), setFrozenRows() {},
        getLastRow: () => data.length, getLastColumn: () => data[0].length,
        getRange(row, column, height = 1, width = 1) {
          return {
            getValues: () => data.slice(row - 1, row - 1 + height).map(r => r.slice(column - 1, column - 1 + width)),
            setValue: value => { data[row - 1][column - 1] = value; },
            setValues: values => values.forEach((r, i) => r.forEach((v, j) => { data[row - 1 + i][column - 1 + j] = v; })),
          };
        },
      };
      sheets.set(name, sheet); return sheet;
    },
  };
  let serial = 0;
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key] }) },
    SpreadsheetApp: { openById: () => book, flush() {} },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    Utilities: { getUuid: () => (++serial).toString(16).padStart(32, '0') },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ value, setMimeType() { return this; } }) },
    HtmlService: { createHtmlOutput: value => value },
    MailApp: { getRemainingDailyQuota: () => quota, sendEmail: mail => { if (quota < 1) throw Error('quota'); sent.push(mail); quota--; } },
  });
  vm.runInContext(fs.readFileSync('google/newsletter/Code.gs', 'utf8'), context);
  let issue = { id: 'issue-1', title: 'First', url: 'https://example.com/uploads/newsletters/first.pdf' };
  context.latestIssue_ = () => issue;
  const post = body => JSON.parse(context.doPost({ parameter: {}, postData: { contents: JSON.stringify(body) } }).value);
  return { context, sheets, sent, post, setQuota: value => { quota = value; }, setIssue: value => { issue = value; } };
}

test('confirmation, consent, duplicate signup, unsubscribe and send deduplication', () => {
  const h = googleHarness();
  assert.equal(h.post({ secret: 'wrong', consent: true, email: 'a@example.com' }).accepted, false);
  assert.equal(h.post({ secret: 'secret', consent: false, email: 'a@example.com' }).accepted, false);
  assert.equal(h.post({ secret: 'secret', consent: true, email: 'a@example.com' }).accepted, true);
  h.post({ secret: 'secret', consent: true, email: 'a@example.com' });
  const people = h.sheets.get('Subscribers').data;
  assert.equal(people.length, 2);
  assert.equal(h.sent.length, 1); // Signup sends confirmation immediately.
  h.context.processNewsletterQueue();
  assert.equal(h.sent.length, 1); // No duplicate on the scheduled run.
  const token = people[1][2];
  h.context.doGet({ parameter: { action: 'confirm', token } });
  assert.equal(people[1][1], 'pending'); // Link scanners cannot confirm.
  h.context.doPost({ parameter: { action: 'confirm', token } });
  h.context.processNewsletterQueue();
  h.context.processNewsletterQueue();
  assert.equal(h.sent.length, 2); // One newsletter, not two.
  assert.equal(h.sheets.get('Deliveries').data[1][5], 'sent');
  h.context.doPost({ parameter: { action: 'unsubscribe', token } });
  h.setIssue({ id: 'issue-2', title: 'Second', url: 'https://example.com/uploads/newsletters/second.pdf' });
  h.context.processNewsletterQueue();
  assert.equal(h.sent.length, 2);
});

test('exhausted quota keeps deliveries queued and preserves older issues', () => {
  const h = googleHarness();
  h.setQuota(0);
  h.post({ secret: 'secret', consent: true, email: 'a@example.com' });
  const person = h.sheets.get('Subscribers').data[1];
  h.context.doPost({ parameter: { action: 'confirm', token: person[2] } });
  h.setQuota(0); h.context.processNewsletterQueue();
  assert.equal(h.sheets.get('Deliveries').data[1][5], 'queued');
  h.setIssue({ id: 'issue-2', title: 'Second', url: 'https://example.com/uploads/newsletters/second.pdf' });
  h.setQuota(1); h.context.processNewsletterQueue();
  assert.equal(h.sent[0].subject, 'StatSoc newsletter: First');
  assert.equal(h.sheets.get('Deliveries').data[2][5], 'queued');
  h.setQuota(1); h.context.processNewsletterQueue();
  assert.equal(h.sent[1].subject, 'StatSoc newsletter: Second');
});

test('ambiguous email failures require review and are not automatically resent', () => {
  const h = googleHarness();
  h.post({ secret: 'secret', consent: true, email: 'a@example.com' });
  h.context.doPost({ parameter: { action: 'confirm', token: h.sheets.get('Subscribers').data[1][2] } });
  h.context.MailApp.sendEmail = () => { throw Error('Ambiguous failure'); };
  h.context.processNewsletterQueue();
  assert.equal(h.sheets.get('Deliveries').data[1][5], 'review');
  h.context.MailApp.sendEmail = mail => h.sent.push(mail);
  h.context.processNewsletterQueue();
  assert.equal(h.sent.length, 1); // Only the immediate confirmation.
});

test('Netlify proxy rejects invalid requests and never exposes shared credentials', async () => {
  const previous = { ...process.env }, originalFetch = globalThis.fetch;
  try {
    process.env.NEWSLETTER_SITE_URL = 'https://example.com';
    process.env.NEWSLETTER_SCRIPT_URL = 'https://script.google.com/macros/s/test/exec';
    process.env.NEWSLETTER_SHARED_SECRET = 'private-secret';
    const request = (body, origin = 'https://example.com') => new Request('https://example.com/.netlify/functions/newsletter-subscribe', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await subscribe(request({email:'a@example.com',consent:true}, 'https://evil.example'))).status, 403);
    assert.equal((await subscribe(request({email:'bad',consent:true}))).status, 400);
    assert.equal((await subscribe(request({email:'a@example.com',consent:false}))).status, 400);
    globalThis.fetch = async (_url, options) => {
      assert.equal(JSON.parse(options.body).secret, 'private-secret');
      return Response.json({ accepted: true });
    };
    const response = await subscribe(request({email:'a@example.com',consent:true}));
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { accepted: true });
    globalThis.fetch = async () => Response.json({ accepted: false });
    assert.equal((await subscribe(request({email:'a@example.com',consent:true}))).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of ['NEWSLETTER_SITE_URL','NEWSLETTER_SCRIPT_URL','NEWSLETTER_SHARED_SECRET']) {
      if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key];
    }
  }
});

test('confirmation waits for capacity when signup occurs at zero quota', () => {
  const h = googleHarness();
  h.setQuota(0);
  assert.equal(h.post({ secret: 'secret', consent: true, email: 'queued@example.com' }).accepted, true);
  assert.equal(h.sent.length, 0);
  assert.equal(h.sheets.get('Subscribers').data[1][4], '');
  h.setQuota(1);
  h.context.processNewsletterQueue();
  assert.equal(h.sent.length, 1);
  assert.match(h.sent[0].subject, /Confirm/);
});
