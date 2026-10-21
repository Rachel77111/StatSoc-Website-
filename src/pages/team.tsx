import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, Plus, Sparkles, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import teamContent from '../../content/team.json';
import { useCmsContent } from '@/lib/use-cms-content';

const filters = [
  { id: 'all', label: 'Everyone' },
  { id: 'big-four', label: 'The Big Four' },
  { id: 'directors', label: 'Directors' },
] as const;

const scenes = [
  { label: 'The spark', symbol: '✦', title: 'Good things start with “what if?”', description: 'A workshop, a new connection, a reason to get together. Every idea starts somewhere.', credit: 'Curiosity brings us together.' },
  { label: 'The teamwork', symbol: '↗', title: 'Different minds. Shared momentum.', description: 'Leadership, creativity, planning and data. Explore the roles that help an idea find its feet.', credit: 'Everyone brings something to the table.' },
  { label: 'The community', symbol: '◎', title: 'The best part? You’re in it.', description: 'Our team is only part of the story. Come along, meet someone new and make StatSoc your own.', credit: 'Your next connection could start here.' },
] as const;

export default function TeamPage() {
  const content = useCmsContent('team', teamContent);
  const [filter, setFilter] = useState<string>('all');
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = scenes[sceneIndex];
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay },
  });

  return (
    <>
      <Helmet>
        <title>Meet our team — StatSoc</title>
        <meta name="description" content="Meet the Big Four and directors behind the University of Sydney Statistics Society." />
      </Helmet>
      <main className="bg-[#fffdf5] text-secondary">
        <section className="relative overflow-hidden bg-secondary px-6 pb-14 pt-28 text-white sm:pb-16 sm:pt-32">
          <div aria-hidden="true" className="absolute -right-24 top-12 h-96 w-96 rounded-full border-[48px] border-primary/10 sm:h-[32rem] sm:w-[32rem]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <motion.div {...reveal()}>
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles size={16} /> The people behind StatSoc</p>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{content.heading}<span className="text-primary">.</span></h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">{content.intro}</p>
              <a href="#team" className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Explore the team <ArrowDown size={18} /></a>
            </motion.div>
            <motion.div {...reveal(0.12)} className="relative overflow-hidden rounded-3xl border border-white/20 bg-[#252538] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-widest text-primary">Behind the scenes</p>
                <span className="font-mono text-xs text-white/50">0{sceneIndex + 1} / 03</span>
              </div>
              <div aria-label="Explore the StatSoc story" className="mt-4 flex flex-wrap gap-2">
                {scenes.map((item, index) => <button key={item.label} type="button" aria-pressed={sceneIndex === index} onClick={() => setSceneIndex(index)} className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${sceneIndex === index ? 'bg-primary text-secondary' : 'bg-white/5 text-white/70 hover:bg-white/15'}`}>{item.label}</button>)}
              </div>
              <div aria-live="polite" aria-atomic="true" className="min-h-[14rem]">
                <motion.div key={sceneIndex} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                  <span aria-hidden="true" className="mt-4 block text-4xl leading-none text-primary">{scene.symbol}</span>
                  <h2 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">{scene.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{scene.description}</p>
                  <p className="mt-4 border-t border-white/15 pt-3 text-xs text-white/55">{scene.credit}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div id="team" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-14 sm:py-20">
          <div className="mb-14 flex flex-wrap items-center justify-between gap-5">
            <p className="flex items-center gap-2 text-sm text-secondary/65"><Users size={18} /> Get to know what each role brings.</p>
            <div aria-label="Filter team roles" className="flex flex-wrap gap-2">
              {filters.map(({ id, label }) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${filter === id ? 'bg-secondary text-white' : 'bg-secondary/5 text-secondary hover:bg-primary/30'}`}>{label}</button>)}
            </div>
          </div>

          {['big-four', 'directors'].filter(group => filter === 'all' || filter === group).map(group => (
            <section key={group} aria-labelledby={`${group}-heading`} className="mb-20 last:mb-0">
              <div className="mb-8 flex items-start gap-4 border-t border-secondary/15 pt-7">
                <span className="pt-1 font-mono text-sm text-secondary/50">{group === 'big-four' ? '01' : '02'}</span>
                <div><h2 id={`${group}-heading`} className="text-3xl font-bold sm:text-4xl">{group === 'big-four' ? 'The Big Four' : 'Our Directors'}</h2><p className="mt-3 max-w-xl text-secondary/65">{group === 'big-four' ? 'The leadership roles that keep our society connected, organised and looking ahead.' : 'The portfolios that turn ideas into experiences, connections and insights.'}</p></div>
              </div>
              <div className={`grid gap-5 sm:grid-cols-2 ${group === 'big-four' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {content.roles.filter(role => role.group === group).map((role, index) => (
                  <motion.article whileHover={reduceMotion ? undefined : { y: -5 }} key={role.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : index * 0.04 }} className="group overflow-hidden rounded-2xl border border-secondary/10 bg-white transition-shadow hover:shadow-xl focus-within:shadow-xl">
                    <div className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden ${group === 'big-four' ? 'bg-[#f7df86]' : 'bg-[#dedfea]'}`}>
                      {role.image ? <img src={role.image} alt={role.name || role.title} className="h-full w-full object-cover" /> : <>
                        <div aria-hidden="true" className="absolute h-40 w-40 rounded-full border border-secondary/15 transition-transform duration-500 motion-safe:group-hover:scale-125" />
                        <div aria-hidden="true" className="absolute h-28 w-28 rotate-45 rounded-3xl border border-secondary/15" />
                        <span aria-hidden="true" className="text-6xl font-bold tracking-tighter text-secondary/80">{role.title.split(' ').map(word => word[0]).join('')}</span>
                      </>}
                      <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-secondary">{role.focus}</span>
                    </div>
                    <div className="p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary/50">{role.name || 'Meet the role'}</p>
                      <h3 className="text-xl font-bold">{role.title}</h3>
                      <p className="mt-2 text-sm text-secondary/65">{role.tagline}</p>
                      <details className="mt-5 border-t border-secondary/10 pt-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">About this role <Plus size={16} aria-hidden="true" /></summary>
                        <p className="mt-4 text-sm leading-relaxed text-secondary/70">{role.description}</p>
                      </details>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <motion.section {...reveal()} className="border-t border-secondary/10 bg-primary/20 px-6 py-14">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6"><div><h2 className="text-2xl font-bold sm:text-3xl">There’s a place for you here, too.</h2><p className="mt-3 text-secondary/70">Come for the statistics. Stay for the community.</p></div><Link to="/membership" className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary/80">Join StatSoc <ArrowUpRight size={18} /></Link></div>
        </motion.section>
      </main>
    </>
  );
}
