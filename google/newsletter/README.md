# Automatic Google newsletter setup

The website submits subscriptions to a Netlify Function. That function privately forwards requests to a Google Apps Script web app. A private Google Sheet stores subscribers and a delivery queue. A scheduled script checks the live site's newest PDF every 15 minutes. There is no Google Group membership or Google sign-in requirement for subscribers.

Email contains a PDF **link**, not an attachment. The Gmail account running the script sends the messages; replies go to statsoc.sydney@gmail.com.

## 1. Create the private subscriber database

Sign in with the society's Google account, ideally `statsoc.sydney@gmail.com`.

1. Create a Google Sheet named **StatSoc Newsletter**. Keep sharing restricted to trusted newsletter administrators.
2. Copy its ID from `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`.
3. Open **Extensions → Apps Script**. Replace the editor's default code with the contents of [Code.gs](Code.gs).
4. In **Project Settings → Script properties**, add:

| Property | Value |
| --- | --- |
| `SPREADSHEET_ID` | The spreadsheet ID |
| `SITE_URL` | `https://usydstatsoc.netlify.app` (no page path) |
| `SHARED_SECRET` | A long random value, at least 32 random bytes; save the same value in Netlify later |

For example, generate a secret locally with `openssl rand -hex 32`. Never commit it or put it into a `VITE_` variable. The sheet and script must stay private even though the script's deployed endpoint is public.

## 2. Deploy the Google endpoint

1. In Apps Script, select **Deploy → New deployment → Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**. Subscribers must be able to open confirmation links without a Google account. If your organisation disables public web apps, this setup needs an administrator change or another provider.
3. Authorise access to the society's spreadsheet, email sending and external requests. Review the permissions for this script you installed. If Google prevents authorisation, resolve the account policy before proceeding.
4. Copy the deployed **Web app URL** ending in `/exec`, not the testing URL ending in `/dev`.
5. Add it as Script Property `WEB_APP_URL`.
6. Select and run `setupNewsletter` from the editor, authorising it if prompted. It creates **Subscribers** and **Deliveries** tabs and one 15-minute trigger. Running setup again replaces only this script's newsletter trigger; it does not clear subscriber data.

When changing script code later, use **Deploy → Manage deployments → Edit → New version** to update the existing deployment. Preserve its URL so old confirmation and unsubscribe links continue to work. Pause the trigger before replacing production code.

## 3. Connect Netlify

Under your project's environment variables, add the following with **Functions** scope (or all scopes if your UI does not offer scope selection):

| Variable | Value |
| --- | --- |
| `NEWSLETTER_SITE_URL` | `https://usydstatsoc.netlify.app` |
| `NEWSLETTER_SCRIPT_URL` | Your deployed Google `/exec` URL |
| `NEWSLETTER_SHARED_SECRET` | Exactly the same value as Script Property `SHARED_SECRET` |

Commit and push the application code and redeploy Netlify. The function lives in the standard `netlify/functions` directory and needs no extra dependencies. Plain Vite (`npm run dev`) does not run Netlify Functions; use the deployed site or Netlify Dev to exercise subscriptions. The subscription endpoint accepts requests only from the configured main website origin, not deploy preview domains.

## 4. Test with your own address first

1. Visit the deployed `/newsletter`, enter your email, tick consent, and submit. You should see a pending confirmation message, not an assertion that you are already subscribed.
2. In the sheet, check your row is **pending**. The signup immediately attempts to send a confirmation. Check your inbox/spam folder. If sending capacity is exhausted, the scheduled queue sends it later.
3. Open the confirmation link and press **Confirm subscription**. Check the row changes to **confirmed**. Merely opening a link does not change membership, to avoid email scanner activations.
4. Upload a real PDF under **Admin → Newsletter → Newsletter page**. Give the issue a unique ID such as `2026-11`, put it first and publish. Wait for the Netlify deployment to complete.
5. Run `processNewsletterQueue` or wait for its next scheduled run. Check the email, PDF link, and **sent** delivery record.
6. Run again: the same issue must not send a second time. Edit its title with the same ID and publish: it still must not resend.
7. Open the unsubscribe link and press **Unsubscribe**. The subscriber becomes **unsubscribed**. Verify they do not receive a subsequent test edition with a different ID.
8. Remove test content as needed, keeping production delivery records intact. Only then invite subscribers.

These steps exercise real Google permissions and mail delivery; local tests cannot verify them.

## Publishing rules and delivery limits

- The first archive entry with a PDF is the latest edition; the actual first entry must have a PDF or nothing new is queued. Upload PDFs into `/uploads/newsletters/`, using simple filenames such as `statsoc-2026-11.pdf`. External PDF hosts are not supported by automation. The script verifies the uploaded file has a PDF signature before queuing it.
- **A new issue ID means a new mailing.** Changing the PDF, title or order while preserving that ID does not resend it to previous recipients. Do not reuse old IDs for a new edition.
- Emails begin only after the PDF is deployed and the script's next check runs. Publishing is the send action; there is no separate send button. The script detects the latest issue at each check, so do not publish several editions between checks if you want each to be emailed.
- A newly confirmed subscriber receives the current latest edition on the next check. Earlier editions remain available on the website. Existing queued editions remain queued even if a newer edition is published.
- A personal Gmail Apps Script account currently has a quota of **100 recipients per rolling daily allowance** shared across its scripts. Confirmation emails consume quota too. Quotas can change; the script checks the remaining allowance and leaves unsent jobs queued. A mailing to 100 people may span multiple days when confirmations or other scripts use the allowance.
- Confirmation emails are attempted immediately on signup; newsletter deliveries remain on the 15-minute schedule.
- New signup requests are capped at 50 per rolling 24 hours. Confirmation messages are capped at 20 per rolling 24 hours to limit signup abuse. Pending requests wait for capacity. Confirmation links expire seven days after requesting. The same pending address cannot repeatedly generate confirmation emails; after expiry it can request again.
- Keep an eye on **Apps Script → Executions**, trigger failure emails and the sheet. Google mail delivery is not guaranteed; this system does not track bounces, spam placement or opens.

## Delivery review and unsubscribe

The **Deliveries** tab records each recipient/issue pair. Do not delete rows after sending: they prevent duplicates. Normal statuses are `queued`, `sending`, `sent`, `cancelled` and `review`.

A job is marked `sending` and flushed before contacting the mail service. If the call fails ambiguously, it becomes `review`; an interrupted run may leave it `sending`. These are **not automatically retried**, because sending and updating a sheet cannot be one atomic operation. Inspect Google mail logs/recipient delivery before manually changing a failed row back to `queued`. That retry can duplicate a message if the original was delivered. This favours avoiding duplicate emails over retrying an uncertain send automatically.

If a confirmation was not delivered but its timestamp is set, investigate before clearing **confirmationSentAt** to allow one retry. Do not edit an unsubscribed person's status to confirmed; they need to resubscribe and confirm again. Restrict sheet access, honour deletion requests, and periodically remove expired pending data according to the society's retention policy. Deleting delivery history can permit resending, so handle deletion requests deliberately.

To pause automatic emails, delete/disable the `processNewsletterQueue` trigger in Apps Script. Re-run `setupNewsletter` to resume. Website signup requests will remain pending while delivery is paused.

References: [Google web app deployment](https://developers.google.com/apps-script/guides/web), [installable triggers](https://developers.google.com/apps-script/guides/triggers/installable), [sending quotas](https://developers.google.com/apps-script/guides/services/quotas), [Netlify Functions](https://docs.netlify.com/build/functions/get-started/).
