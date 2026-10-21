import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowRight, BriefcaseBusiness, FlaskConical, GraduationCap, Trophy, Search } from 'lucide-react';
import opportunitiesContent from '../../content/opportunities.json';
import { useCmsContent } from '@/lib/use-cms-content';

type OpportunitiesContent = Omit<typeof opportunitiesContent, 'items'> & {
  items: { title: string; description: string; button: string; href: string; image?: string }[];
};
const pathways = [
  { label: 'Careers', icon: BriefcaseBusiness, colour: 'bg-[#f7df86]', title: 'Your first step into data', description: 'A place for internships and graduate roles that turn classroom knowledge into practical experience.', detail: 'Internships · Graduate roles' },
  { label: 'Research', icon: FlaskConical, colour: 'bg-[#dedfea]', title: 'Big questions. New possibilities.', description: 'Discover where statistics can take you through research projects and student research programs.', detail: 'Student projects · Research programs' },
  { label: 'Scholarships', icon: GraduationCap, colour: 'bg-[#dcece2]', title: 'Support for what comes next', description: 'Find funding opportunities that can help you pursue your studies and explore a new direction.', detail: 'Study support · Funding' },
  { label: 'Competitions', icon: Trophy, colour: 'bg-[#f7dfd3]', title: 'A challenge worth teaming up for', description: 'Explore data challenges and case competitions where you can learn by doing, together.', detail: 'Data challenges · Case competitions' },
];


// Example content for previewing the board before real CMS listings are added.
const exampleOpportunities = [
  ...pathways,
  { ...pathways[0], title: 'Explore a day in analytics', description: 'An example industry insight opportunity to learn how analysts approach real-world problems.', detail: 'Placeholder · Industry insights' },
  { ...pathways[1], title: 'Turn curiosity into a project', description: 'An example student project exploring a dataset, testing an idea and sharing what you discover.', detail: 'Placeholder · Student research' },
  { ...pathways[3], title: 'Find your next data challenge', description: 'An example team challenge combining data storytelling, problem-solving and a fresh perspective.', detail: 'Placeholder · Team challenge' },
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
  const hasListings = opportunities.items.length > 0;
  const query = search.trim().toLowerCase();
  const examples = exampleOpportunities.filter(item => (category === 'All' || item.label === category) && `${item.label} ${item.title} ${item.description}`.toLowerCase().includes(query));
  const listings = opportunities.items.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query));
  const resultCount = hasListings ? listings.length : examples.length;
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
          {!hasListings && <div className="mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map(({ label, icon: Icon, detail, colour }, index) => <motion.a {...reveal(index * 0.06)} whileHover={reduceMotion ? undefined : { y: -4 }} key={label} href="#opportunity-board" onClick={() => { setCategory(label); setSearch(''); setVisibleCount(6); }} className={`group rounded-2xl p-5 transition-shadow hover:shadow-md ${colour}`}><div className="mb-5 flex items-center justify-between"><Icon size={23} /><ArrowUpRight size={18} /></div><h2 className="text-lg font-bold">{label}</h2><p className="mt-1 text-xs text-secondary/65">{detail}</p></motion.a>)}
          </div>}
          <section id="opportunity-board" className="scroll-mt-28" aria-labelledby="board-heading">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary/50">Find your direction</p><h2 id="board-heading" className="text-3xl font-bold">The opportunity board</h2></div><label className="flex w-full items-center gap-3 rounded-full border border-secondary/15 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary sm:w-72"><Search size={17} className="shrink-0 text-secondary/50" /><span className="sr-only">Search opportunities</span><input value={search} onChange={event => { setSearch(event.target.value); setVisibleCount(6); }} placeholder="What are you curious about?" className="min-w-0 w-full bg-transparent text-sm outline-none" type="search" /></label></div>
            {!hasListings && <>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap" aria-label="Filter example opportunities">{['All', ...pathways.map(item => item.label)].map(label => <button key={label} type="button" aria-pressed={category === label} onClick={() => { setCategory(label); setVisibleCount(6); }} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === label ? 'bg-secondary text-white' : 'bg-secondary/5 hover:bg-primary/25'}`}>{label}</button>)}</div>
            </>}
            <div id="opportunity-results" className="grid gap-4 sm:grid-cols-2" aria-live="polite">
              {hasListings ? listings.slice(0, visibleCount).map((item, index) => <motion.article {...reveal(Math.min(index, 5) * 0.05)} whileHover={reduceMotion ? undefined : { y: -3 }} key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-secondary/10 bg-white">{item.image && <img src={item.image} alt="" className="h-44 w-full object-cover" loading="lazy" />}<div className="p-6"><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-secondary/65">{item.description}</p>{item.href && <a href={item.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">{item.button || 'Learn more'}<ArrowUpRight size={17} /></a>}</div></motion.article>) : examples.slice(0, visibleCount).map(({ label, title, description, detail, icon: Icon }, index) => <motion.article {...reveal(index * 0.06)} whileHover={reduceMotion ? undefined : { y: -3 }} key={title} className="rounded-2xl border border-secondary/10 bg-white p-6 transition-shadow hover:shadow-md"><div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-secondary/5 px-3 py-1 text-xs font-semibold">{label}</span><Icon size={22} className="text-secondary/50" /></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-secondary/65">{description}</p><p className="mt-6 border-t border-secondary/10 pt-4 text-xs text-secondary/50">{detail}</p></motion.article>)}
            </div>
            {resultCount > 0 && <div className="mt-7 flex flex-col items-center gap-4">
              <p role="status" className="text-sm text-secondary/60">Showing {Math.min(visibleCount, resultCount)} of {resultCount} opportunities</p>
              {visibleCount < resultCount && <button type="button" aria-controls="opportunity-results" onClick={() => setVisibleCount(count => count + 6)} className="rounded-full border border-secondary/20 bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Show more</button>}
            </div>}
            {(hasListings ? listings.length === 0 : examples.length === 0) && <p role="status" className="py-12 text-center text-secondary/60">No matches. Try another search or category.</p>}
          </section>
          <motion.section {...reveal()} className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[#e7e7ef] p-7 sm:p-9"><div><h2 className="text-2xl font-bold">Build connections along the way.</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-secondary/65">Explore StatSoc events and meet people who share your interest in statistics and data.</p></div><Link to="/events" className="inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary/80">Explore events <ArrowUpRight size={17} /></Link></motion.section>
        </div>
      </main>
    </>
  );
}
