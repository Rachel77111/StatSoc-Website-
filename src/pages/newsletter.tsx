import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, BookOpen, Download, FileText, Mail, Search } from 'lucide-react';
import newsletterContent from '../../content/newsletter.json';
import { useCmsContent } from '@/lib/use-cms-content';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

type Issue = { id: string; tag: string; date: string; title: string; preview: string; href?: string; cover?: string };
type NewsletterContent = { hero: { title: string; subtitle: string }; archive: { heading: string; description: string; issues: Issue[] } };

function PdfLinks({ issue }: { issue: Issue }) {
  if (!issue.href) return <p className="mt-5 text-sm text-secondary/60">PDF coming soon</p>;
  return <div className="mt-6 flex flex-wrap items-center gap-4">
    <a href={issue.href} target="_blank" rel="noreferrer" aria-label={`Read ${issue.title} PDF (opens in a new tab)`} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/80">Read PDF <ArrowUpRight size={16} /></a>
    <a href={issue.href} download aria-label={`Download ${issue.title} PDF`} className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"><Download size={16} />Download</a>
  </div>;
}

export default function NewsletterPage() {
  const content = useCmsContent<NewsletterContent>('newsletter', newsletterContent);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('All');
  const reduceMotion = useReducedMotion();
  const reveal = { initial: reduceMotion ? false as const : { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: reduceMotion ? 0 : 0.4 } };
  // Admin list order is intentional: the first issue is the featured latest edition.
  const issues = content.archive.issues;
  const latest = issues[0];
  const issueYear = (issue: Issue) => issue.date.match(/\b(?:19|20)\d{2}\b/)?.[0];
  const years = [...new Set(issues.map(issueYear).filter((value): value is string => !!value))].sort().reverse();
  const filtered = issues.filter(issue => (year === 'All' || issueYear(issue) === year) && `${issue.title} ${issue.preview} ${issue.tag} ${issue.date}`.toLowerCase().includes(search.trim().toLowerCase()));

  return <>
    <Helmet><title>Newsletter — StatSoc</title><meta name="description" content={content.hero.subtitle} /></Helmet>
    <main className="min-h-screen bg-[#fffdf5] text-secondary">
      <section className="bg-secondary px-6 pb-16 pt-32 text-white">
        <motion.div {...reveal} className="mx-auto max-w-6xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Mail size={16} /> From our inbox to yours</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{content.hero.title}<span className="text-primary">.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">{content.hero.subtitle}</p>
          <a href="#archive" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-secondary hover:bg-white">Browse the editions <BookOpen size={17} /></a>
        </motion.div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {latest && <motion.section {...reveal} aria-labelledby="latest-heading" className="mb-16 grid overflow-hidden rounded-3xl border border-secondary/10 bg-white md:grid-cols-[0.7fr_1.3fr]">
          <div className="flex min-h-64 items-center justify-center bg-[#f7df86] p-7">
            {latest.cover ? <img src={latest.cover} alt={`Cover of ${latest.title}`} className="max-h-80 w-full object-contain drop-shadow-lg" /> : <div className="w-48 rotate-[-4deg] rounded-sm border border-secondary/10 bg-[#fffdf5] p-6 shadow-xl"><span className="text-xs font-bold uppercase tracking-widest">StatSoc / Newsletter</span><FileText size={48} className="my-7 text-secondary/70" /><p className="text-xl font-bold">{latest.title}</p><p className="mt-4 text-xs text-secondary/60">{latest.date}</p></div>}
          </div>
          <div className="p-7 sm:p-10"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary/55">Latest edition · PDF</p><h2 id="latest-heading" className="text-3xl font-bold">{latest.title}</h2><p className="mt-3 text-sm text-secondary/55">{latest.date}{latest.tag && ` · ${latest.tag}`}</p><p className="mt-5 max-w-xl leading-relaxed text-secondary/70">{latest.preview}</p><PdfLinks issue={latest} /></div>
        </motion.section>}
        <section id="archive" aria-labelledby="archive-heading" className="scroll-mt-28">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6"><div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary/50">The reading room</p><h2 id="archive-heading" className="text-3xl font-bold">{content.archive.heading}</h2><p className="mt-3 text-sm text-secondary/65">{content.archive.description}</p></div>
            {issues.length > 0 && <div className="flex w-full flex-wrap gap-3 sm:w-auto"><label className="flex items-center gap-2 rounded-full border border-secondary/15 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary"><Search size={17} /><span className="sr-only">Search newsletter editions</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Find an edition…" className="w-44 bg-transparent text-sm outline-none" /></label><label className="sr-only" htmlFor="newsletter-year">Filter by year</label><select id="newsletter-year" value={year} onChange={event => setYear(event.target.value)} className="rounded-full border border-secondary/15 bg-white px-4 py-3 text-sm"><option value="All">All years</option>{years.map(value => <option key={value}>{value}</option>)}</select></div>}
          </div>
          {issues.length === 0 ? <div className="rounded-2xl border border-dashed border-secondary/20 bg-white px-6 py-14 text-center"><FileText size={36} className="mx-auto mb-5 text-secondary/35" /><h3 className="text-xl font-bold">Our reading room is getting ready</h3><p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary/65">Newsletter PDFs will appear here once published. Already received an edition by email? You can keep reading your copy there.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(issue => <motion.article {...reveal} key={issue.id} className="flex flex-col overflow-hidden rounded-2xl border border-secondary/10 bg-white transition-shadow hover:shadow-lg">{issue.cover && <img src={issue.cover} alt={`Cover of ${issue.title}`} loading="lazy" className="h-48 w-full bg-secondary/5 object-contain p-3" />}<div className="flex flex-1 flex-col p-6"><p className="flex items-center gap-2 text-xs text-secondary/55"><FileText size={15} />PDF edition · {issue.date}</p><h3 className="mt-4 text-xl font-bold">{issue.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-secondary/65">{issue.preview}</p><PdfLinks issue={issue} /></div></motion.article>)}</div>}
          {issues.length > 0 && filtered.length === 0 && <p role="status" className="py-12 text-center text-secondary/65">No editions match. Try another search or year.</p>}
        </section>
        <NewsletterSubscribe />
      </div>
    </main>
  </>;
}
