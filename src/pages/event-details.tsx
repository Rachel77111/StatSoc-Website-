import { Helmet } from '@dr.pogodin/react-helmet';
import { Link, useParams } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Calendar, Check, Clock, MapPin, Ticket, Sparkles } from 'lucide-react';
import { useEventsContentWithStatus } from '@/lib/use-events-content';
import { eventDetailsPath, eventRegistrationUrl } from '@/lib/event-links';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { content, isLoading } = useEventsContentWithStatus();
  const reduceMotion = useReducedMotion();
  const event = content.events.find(item => item.id === id);
  if (isLoading) return <main className="min-h-[60vh] px-6 pb-20 pt-36 text-center text-secondary"><p role="status">Loading event details…</p></main>;
  if (!event) return <main className="min-h-[60vh] px-6 pb-20 pt-36 text-center text-secondary"><Helmet><title>Event not found — StatSoc</title><meta name="robots" content="noindex" /></Helmet><h1 className="text-3xl font-bold">Event not found</h1><p className="mt-4 text-muted-foreground">This event may have been removed or moved to our past events.</p><Link to="/events" className="mt-7 inline-flex items-center gap-2 font-semibold underline"><ArrowLeft size={16} />Back to events</Link></main>;
  const registration = eventRegistrationUrl(event.registrationUrl);
  const highlights = event.highlights?.filter(item => item.trim()) ?? [];
  const related = content.events.filter(item => item.id !== event.id).slice(0, 2);
  const facts = [
    { label: 'When', value: event.date, icon: Calendar },
    { label: 'Time', value: event.time, icon: Clock },
    { label: 'Where', value: event.location, icon: MapPin },
    ...(event.price ? [{ label: 'Admission', value: event.price, icon: Ticket }] : []),
  ];
  const reveal = { initial: reduceMotion ? false as const : { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: reduceMotion ? 0 : 0.4 } };
  return <>
    <Helmet><title>{event.title} — StatSoc</title><meta name="description" content={event.description} /><meta property="og:title" content={`${event.title} — StatSoc`} /><meta property="og:description" content={event.description} /></Helmet>
    <main className="min-h-screen bg-[#fffdf5] text-secondary">
      <section className="relative overflow-hidden bg-secondary px-6 pb-16 pt-28 text-white sm:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full border-[50px] border-primary/10" />
        <div className="relative mx-auto max-w-6xl">
          <Link to="/events" className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-primary"><ArrowLeft size={16} />All events</Link>
          <motion.div {...reveal} className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-secondary">{event.tag}</span>{event.featured && <span className="inline-flex items-center gap-1.5 text-xs text-white/65"><Sparkles size={14} />Featured event</span>}</div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{event.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{event.description}</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80"><span className="inline-flex items-center gap-2"><Calendar size={17} className="text-primary" />{event.date}</span><span className="inline-flex items-center gap-2"><Clock size={17} className="text-primary" />{event.time}</span></div>
          </motion.div>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr] md:py-14">
        <div className="min-w-0 space-y-8">
          {event.image && <motion.figure {...reveal} className="overflow-hidden rounded-3xl border border-secondary/10 bg-secondary/5"><img src={event.image} alt={`${event.title} event poster`} className="max-h-[36rem] w-full object-contain" /></motion.figure>}
          <motion.section {...reveal} aria-labelledby="event-about" className="rounded-3xl border border-secondary/10 bg-white p-6 sm:p-8"><p className="mb-3 font-mono text-xs uppercase tracking-widest text-secondary/50">The plan</p><h2 id="event-about" className="text-2xl font-bold">About this event</h2><p className="mt-5 whitespace-pre-wrap leading-relaxed text-secondary/70">{event.details?.trim() || event.description}</p></motion.section>
          {highlights.length > 0 && <motion.section {...reveal} aria-labelledby="event-highlights" className="rounded-3xl bg-primary/15 p-6 sm:p-8"><h2 id="event-highlights" className="text-2xl font-bold">What to look forward to</h2><ul className="mt-5 space-y-4">{highlights.map((item, index) => <li key={index} className="flex items-start gap-3 text-sm leading-relaxed"><Check size={18} className="mt-0.5 shrink-0" /><span>{item}</span></li>)}</ul></motion.section>}
        </div>
        <motion.aside {...reveal} aria-labelledby="event-at-a-glance" className="rounded-3xl border border-secondary/10 bg-white p-6 shadow-sm md:sticky md:top-28 sm:p-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-secondary/50">Save the details</p><h2 id="event-at-a-glance" className="text-2xl font-bold">Your event at a glance</h2>
          <dl className="my-7 space-y-6">{facts.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-start gap-4"><Icon size={20} aria-hidden="true" className="mt-1 shrink-0" /><div><dt className="text-xs font-semibold uppercase tracking-wider text-secondary/50">{label}</dt><dd className="mt-1 text-sm font-medium leading-relaxed">{value}</dd></div></div>)}</dl>
          {registration ? <><a href={registration} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-bold transition-colors hover:bg-secondary hover:text-white">Register for this event <ArrowUpRight size={18} /></a><p className="mt-3 text-center text-xs text-secondary/55">Opens the registration page in a new tab.</p></> : <p className="rounded-xl bg-secondary/5 p-4 text-sm leading-relaxed text-secondary/65">A registration link hasn’t been added yet. Check back for updates.</p>}
          <a href={`mailto:statsoc.sydney@gmail.com?subject=${encodeURIComponent(`Question about ${event.title}`)}`} className="mt-6 block text-center text-sm font-semibold underline underline-offset-4">Have a question? Contact us</a>
        </motion.aside>
      </div>
      {related.length > 0 && <section className="mx-auto max-w-6xl px-6 pb-16"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Keep exploring</h2><Link to="/events" className="text-sm font-semibold underline underline-offset-4">All events</Link></div><div className="grid gap-4 sm:grid-cols-2">{related.map(item => <Link key={item.id} to={eventDetailsPath(item.id)} className="group rounded-2xl border border-secondary/10 bg-white p-6 transition-shadow hover:shadow-md"><p className="text-xs text-secondary/55">{item.tag} · {item.date}</p><h3 className="mt-3 flex items-center justify-between gap-3 text-lg font-bold">{item.title}<ArrowUpRight size={19} className="shrink-0" /></h3><p className="mt-2 line-clamp-2 text-sm text-secondary/65">{item.description}</p></Link>)}</div></section>}
    </main>
  </>;
}
