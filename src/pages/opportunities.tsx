import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowRight, BriefcaseBusiness, FlaskConical, GraduationCap, Trophy, Search } from 'lucide-react';
import opportunitiesContent from '../../content/opportunities.json';
import { useCmsContent } from '@/lib/use-cms-content';
import { opportunityStatus, isFeaturedOpportunity } from '@/lib/opportunity-status';

type OpportunitiesContent = Omit<typeof opportunitiesContent, 'items'> & {
  items: { title: string; description: string; button: string; href: string; image?: string; status?: string; category?: string; kind?: string; timing?: string; eligibility?: string; checkedOn?: string; closesOn?: string }[];
};

function OpportunityBadges({ status }: { status?: string }) {
  const value = opportunityStatus(status);
  const labels = { upcoming: 'Upcoming · opens soon', available: 'Available · open now', closed: 'Closed · unavailable' };
  const colours = { upcoming: 'bg-[#e7e3f2] text-[#514276]', available: 'bg-[#e0efdf] text-[#295c36]', closed: 'bg-secondary/5 text-secondary/60' };
  return <div className="mb-4 flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${colours[value]}`}>{labels[value]}</span>{isFeaturedOpportunity(value) && <span className="rounded-full bg-primary/30 px-3 py-1 text-xs font-bold text-secondary">Featured</span>}</div>;
}
const pathways = [
  { label: 'Careers', icon: BriefcaseBusiness, colour: 'bg-[#f7df86]', title: 'Your first step into data', description: 'A place for internships and graduate roles that turn classroom knowledge into practical experience.', detail: 'Internships · Graduate roles' },
  { label: 'Research', icon: FlaskConical, colour: 'bg-[#dedfea]', title: 'Big questions. New possibilities.', description: 'Discover where statistics can take you through research projects and student research programs.', detail: 'Student projects · Research programs' },
  { label: 'Scholarships', icon: GraduationCap, colour: 'bg-[#dcece2]', title: 'Support for what comes next', description: 'Find funding opportunities that can help you pursue your studies and explore a new direction.', detail: 'Study support · Funding' },
  { label: 'Competitions', icon: Trophy, colour: 'bg-[#f7dfd3]', title: 'A challenge worth teaming up for', description: 'Explore data challenges and case competitions where you can learn by doing, together.', detail: 'Data challenges · Case competitions' },
];


export default function OpportunitiesPage() {
  const opportunities = useCmsContent<OpportunitiesContent>('opportunities', opportunitiesContent);
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay },
  });
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  const query = search.trim().toLowerCase();
  const statusOrder = (status?: string) => ({ upcoming: 0, available: 1, closed: 2 }[opportunityStatus(status)]);
  const listings = opportunities.items.map(item => ({ ...item, status: opportunityStatus(item.status, item.closesOn, now) })).filter(item => (category === 'All' || item.category === category) && `${item.title} ${item.description} ${item.category || ''} ${opportunityStatus(item.status)}`.toLowerCase().includes(query))
    .sort((a, b) => statusOrder(a.status) - statusOrder(b.status));
  const resultCount = listings.length;
  const visibleListings = listings.filter(item => includeClosed || opportunityStatus(item.status) !== 'closed').slice(0, visibleCount);
  const shownCount = visibleListings.length;
  const categories = pathways.filter(pathway => opportunities.items.some(item => item.category === pathway.label));
  return (
    <>
      <Helmet><title>Opportunities — StatSoc</title><meta name="description" content={opportunities.subheading} /></Helmet>
      <main className="min-h-screen bg-[#fffdf5] text-secondary">
        <section className="bg-secondary px-6 pb-16 pt-32 text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <motion.div {...reveal()}>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your next chapter starts here</p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{opportunities.heading}<span className="text-primary">.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">{opportunities.subheading}</p>
              <a href="#opportunity-board" className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-bold text-secondary hover:bg-white">Explore the board <ArrowRight size={17} /></a>
            </motion.div>
            <motion.div {...reveal(0.12)} className="rounded-3xl border border-white/15 bg-white/5 p-7">
              <div className="mb-7 flex items-center justify-between gap-3"><span className="font-mono text-xs uppercase tracking-widest text-white/50">Beyond the lecture</span><ArrowUpRight className="text-primary" size={25} /></div>
              <p className="text-3xl font-bold leading-snug">A little curiosity.<br />A lot of <span className="text-primary">possibility.</span></p>
              <div className="mt-7 flex items-end gap-3" aria-hidden="true">{[30, 45, 60, 80, 100].map((height, i) => <motion.div key={height} initial={reduceMotion ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.2 + i * 0.08 }} className="origin-bottom flex-1 rounded-t-lg bg-primary" style={{ height: height * 0.7, opacity: 0.25 + i * 0.18 }} />)}</div>
              <p className="mt-4 border-t border-white/15 pt-4 text-xs text-white/55">There’s more than one way to grow.</p>
            </motion.div>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          {categories.length > 0 && <div className="mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ label, icon: Icon, detail, colour }, index) => <motion.a {...reveal(index * 0.06)} whileHover={reduceMotion ? undefined : { y: -4 }} key={label} href="#opportunity-board" onClick={() => { setCategory(label); setSearch(''); setVisibleCount(6); setIncludeClosed(false); }} className={`group rounded-2xl p-5 transition-shadow hover:shadow-md ${colour}`}><div className="mb-5 flex items-center justify-between"><Icon size={23} /><ArrowUpRight size={18} /></div><h2 className="text-lg font-bold">{label}</h2><p className="mt-1 text-xs text-secondary/65">{detail}</p></motion.a>)}
          </div>}
          <section id="opportunity-board" className="scroll-mt-28" aria-labelledby="board-heading">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary/50">Find your direction</p><h2 id="board-heading" className="text-3xl font-bold">The opportunity board</h2></div><label className="flex w-full items-center gap-3 rounded-full border border-secondary/15 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary sm:w-72"><Search size={17} className="shrink-0 text-secondary/50" /><span className="sr-only">Search opportunities</span><input value={search} onChange={event => { setSearch(event.target.value); setVisibleCount(6); setIncludeClosed(false); }} placeholder="What are you curious about?" className="min-w-0 w-full bg-transparent text-sm outline-none" type="search" /></label></div>
            <>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap" aria-label="Filter opportunities">{['All', ...categories.map(item => item.label)].map(label => <button key={label} type="button" aria-pressed={category === label} onClick={() => { setCategory(label); setVisibleCount(6); setIncludeClosed(false); }} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === label ? 'bg-secondary text-white' : 'bg-secondary/5 hover:bg-primary/25'}`}>{label}</button>)}</div>
            </>
            <div id="opportunity-results" className="grid gap-4 sm:grid-cols-2" aria-live="polite">
              {visibleListings.map((item, index) => <motion.article {...reveal(Math.min(index, 5) * 0.05)} whileHover={reduceMotion ? undefined : { y: -3 }} key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-secondary/10 bg-white">{item.image && <img src={item.image} alt="" className="h-44 w-full object-cover" loading="lazy" />}<div className="p-6"><div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-secondary/60">{item.category && <span>{item.category}</span>}{item.kind && <span>· {item.kind}</span>}</div><OpportunityBadges status={item.status} /><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-secondary/65">{item.description}</p><dl className="mt-4 space-y-2 text-xs leading-relaxed text-secondary/65">{item.closesOn && <div><dt className="font-semibold text-secondary">Closing date (Sydney time)</dt><dd>{item.closesOn}</dd></div>}{item.timing && <div><dt className="font-semibold text-secondary">Dates</dt><dd>{item.timing}</dd></div>}{item.eligibility && <div><dt className="font-semibold text-secondary">Who it’s for</dt><dd>{item.eligibility}</dd></div>}{item.checkedOn && <div><dt className="inline">Source checked: </dt><dd className="inline">{item.checkedOn}</dd></div>}</dl>{item.href && <a href={item.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">{opportunityStatus(item.status) === 'closed' ? 'View details' : opportunityStatus(item.status) === 'upcoming' ? 'Preview opportunity' : item.button || 'Learn more'}<ArrowUpRight size={17} /></a>}</div></motion.article>)}
            </div>
            {resultCount > 0 && <div className="mt-7 flex flex-col items-center gap-4">
              <p role="status" className="text-sm text-secondary/60">Showing {shownCount} of {resultCount} opportunities</p>
              {shownCount < resultCount && <button type="button" aria-controls="opportunity-results" onClick={() => { setIncludeClosed(true); setVisibleCount(shownCount + 6); }} className="rounded-full border border-secondary/20 bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Show more</button>}
            </div>}
            {listings.length === 0 && <p role="status" className="py-12 text-center text-secondary/60">No matches. Try another search or category.</p>}
          </section>
          <motion.section {...reveal()} className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[#e7e7ef] p-7 sm:p-9"><div><h2 className="text-2xl font-bold">Build connections along the way.</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-secondary/65">Explore StatSoc events and meet people who share your interest in statistics and data.</p></div><Link to="/events" className="inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary/80">Explore events <ArrowUpRight size={17} /></Link></motion.section>
        </div>
      </main>
    </>
  );
}
