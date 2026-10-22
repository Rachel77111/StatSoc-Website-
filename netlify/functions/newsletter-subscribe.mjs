const respond = (status, body) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store' },
});

export default async function subscribe(request) {
  if (request.method !== 'POST') return respond(405, { error: 'Use POST.' });
  const endpoint = process.env.NEWSLETTER_SCRIPT_URL;
  const secret = process.env.NEWSLETTER_SHARED_SECRET;
  const site = process.env.NEWSLETTER_SITE_URL;
  if (!endpoint || !secret || !site) return respond(503, { error: 'Subscriptions are not available yet. Please try again later.' });
  try {
    const upstream = new URL(endpoint);
    if (upstream.origin !== 'https://script.google.com' || !upstream.pathname.endsWith('/exec')) throw new Error('Invalid script URL');
    if (request.headers.get('origin') !== new URL(site).origin) return respond(403, { error: 'Please subscribe from the main website.' });
    if (!request.headers.get('content-type')?.includes('application/json')) return respond(415, { error: 'Expected JSON.' });
    const raw = await request.text();
    if (raw.length > 2048) return respond(413, { error: 'Request too large.' });
    let input;
    try { input = JSON.parse(raw); } catch { return respond(400, { error: 'Invalid request.' }); }
    if (!input || typeof input !== 'object') return respond(400, { error: 'Invalid request.' });
    // Quietly discard submissions to the hidden bot field.
    if (input.website) return respond(202, { accepted: true });
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[a-z0-9][a-z0-9.!#$%&'*+\/=?^_`{|}~-]*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email) || input.consent !== true) {
      return respond(400, { error: 'Enter a valid email and agree to receive newsletters.' });
    }
    const response = await fetch(upstream, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, consent: true, secret }), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Subscription service unavailable');
    const result = await response.json();
    if (result.accepted !== true) throw new Error('Subscription not accepted');
    return respond(202, { accepted: true });
  } catch {
    return respond(503, { error: 'We could not process your subscription. Please try again later.' });
  }
}
