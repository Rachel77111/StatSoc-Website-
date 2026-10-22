import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'accepted' | 'error'>('idle');
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/.netlify/functions/newsletter-subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, consent }), signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error(result.error || 'Please try again later.');
      setStatus('accepted');
    } catch (reason) {
      setError(reason instanceof Error && reason.name !== 'SyntaxError' ? reason.message : 'Subscriptions are unavailable right now. Please try again later.');
      setStatus('error');
    }
  }
  return <section aria-labelledby="subscribe-heading" className="mt-14 rounded-3xl bg-[#e7e7ef] p-7 sm:p-9">
    <div className="grid gap-7 md:grid-cols-2">
      <div><h2 id="subscribe-heading" className="text-2xl font-bold">The next edition, straight to your inbox.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-secondary/65">Subscribe for an email with a link to our latest newsletter PDF. Confirm your email to join. You can unsubscribe at any time.</p></div>
      {status === 'accepted' ? <p role="status" className="self-center rounded-2xl border border-secondary/15 bg-white/60 p-5 text-sm leading-relaxed">Thanks! If your address needs confirmation, we’ll email you a link. Delivery may be delayed by our daily sending limit. Already subscribed? You’re all set.</p> : <form onSubmit={submit} className="space-y-4">
        <label htmlFor="newsletter-email" className="block text-sm font-semibold">Email address</label>
        <div className="flex flex-wrap gap-3"><input id="newsletter-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-xl border border-secondary/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /><button disabled={status === 'sending'} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary/80 disabled:opacity-60"><Mail size={16} />{status === 'sending' ? 'Submitting…' : 'Subscribe'}</button></div>
        <div className="hidden" aria-hidden="true"><label htmlFor="newsletter-website">Website</label><input id="newsletter-website" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></div>
        <label className="flex items-start gap-3 text-xs leading-relaxed text-secondary/75"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5" />I agree to receive StatSoc newsletters. My email will be stored privately using Google services for newsletter delivery.</label>
        {status === 'error' && <p role="alert" className="text-sm text-red-800">{error}</p>}
      </form>}
    </div>
  </section>;
}
