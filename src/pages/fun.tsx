import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Shuffle, Sparkles, Gamepad2, Layers } from 'lucide-react';
import funContent from '../../content/fun.json';
import { useCmsContent } from '@/lib/use-cms-content';
import { AverageGame, ProbabilityLab, CorrelationGame, gameOptions } from '@/components/fun/StatsGames';

type Fact = { id:string; question:string; answer:string; category?:string };
type FunContent = { heading:string; subheading:string; image?:string; imageAlt?:string; facts?:Fact[] };
function Flashcards({facts}:{facts:Fact[]}) {
  const reduceMotion = useReducedMotion();
  const [index,setIndex]=useState(0),[flipped,setFlipped]=useState(false);
  const [seen,setSeen]=useState<string[]>([]);
  const currentIndex=index%Math.max(facts.length,1), fact=facts[currentIndex];
  function move(direction:number){setIndex((currentIndex+direction+facts.length)%facts.length);setFlipped(false);}
  if(!fact) return <p className="rounded-3xl border border-dashed border-secondary/20 bg-white p-10 text-center">New questions are on the way. Try a mini game below!</p>;
  function flip(){setFlipped(!flipped);if(!flipped)setSeen(values=>values.includes(fact.id)?values:[...values,fact.id]);}
  const viewed=facts.filter(item=>seen.includes(item.id)).length;
  return <div className="grid items-center gap-8 md:grid-cols-[0.65fr_1.35fr]">
    <div><p className="mb-3 font-mono text-xs uppercase tracking-widest text-secondary/50">Small questions. Big surprises.</p><h2 id="flashcards-heading" className="text-3xl font-bold sm:text-4xl">Think you know<br />your stats?</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-secondary/65">Take a guess before you flip. Some answers might change the way you see everyday life.</p><div className="mt-6 flex items-center gap-3"><span className="font-mono text-2xl font-bold">{viewed}<span className="text-secondary/35">/{facts.length}</span></span><span className="text-xs text-secondary/60">answers explored</span></div><div className="mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-secondary/10"><div className="h-full rounded-full bg-[#68618c] transition-[width] duration-300 motion-reduce:transition-none" style={{width:`${viewed/facts.length*100}%`}}/></div>{viewed===facts.length && <p role="status" className="mt-4 text-sm font-semibold">Deck complete. Curiosity looks good on you!</p>}</div>
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-secondary/55"><span>{fact.category||'Curiosity card'}</span><span>Card {currentIndex+1} of {facts.length}</span></div>
      <motion.div key={fact.id} initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} style={{perspective:1200}}>
        <motion.button whileTap={reduceMotion ? undefined : { scale: 0.97 }} type="button" onClick={flip} aria-pressed={flipped} aria-label={flipped?`Answer: ${fact.answer}. Activate to see the question again.`:`Question: ${fact.question}. Activate to reveal the answer.`} className="block w-full rounded-3xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
          <span className="grid min-h-[20rem] w-full transition-transform duration-500 motion-reduce:transition-none" style={{transformStyle:'preserve-3d',transform:flipped?'rotateY(180deg)':'rotateY(0deg)'}}>
            <span aria-hidden={flipped} className="flex flex-col justify-between rounded-3xl border border-secondary/10 bg-[#f7df86] p-7 sm:p-10" style={{gridArea:'1 / 1',backfaceVisibility:'hidden'}}><span className="flex items-center justify-between font-mono text-xs uppercase tracking-widest"><span>The question</span><Sparkles size={20}/></span><span className="my-7 block text-2xl font-bold leading-snug sm:text-3xl">{fact.question}</span><span className="inline-flex items-center gap-2 text-xs font-semibold">Tap to reveal <RotateCcw size={15}/></span></span>
            <span aria-hidden={!flipped} className="flex flex-col justify-between rounded-3xl bg-secondary p-7 text-white sm:p-10" style={{gridArea:'1 / 1',backfaceVisibility:'hidden',transform:'rotateY(180deg)'}}><span className="font-mono text-xs uppercase tracking-widest text-primary">The reveal</span><span className="my-6 block text-lg leading-relaxed sm:text-xl">{fact.answer}</span><span className="inline-flex items-center gap-2 text-xs text-white/65">Tap to revisit the question <RotateCcw size={15}/></span></span>
          </span>
        </motion.button>
      </motion.div>
      <p role="status" className="sr-only">{flipped?'Answer revealed.':'Question shown.'}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><motion.button whileTap={reduceMotion ? undefined : { scale: 0.97 }} type="button" onClick={()=>move(-1)} disabled={facts.length<2} aria-label="Previous flashcard" className="rounded-full border border-secondary/15 bg-white p-3 hover:bg-primary/20 disabled:opacity-40"><ArrowLeft size={18}/></motion.button><motion.button whileTap={reduceMotion ? undefined : { scale: 0.97 }} type="button" disabled={facts.length<2} onClick={()=>{setIndex((currentIndex+1+Math.floor(Math.random()*(facts.length-1)))%facts.length);setFlipped(false);}} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold disabled:opacity-40"><Shuffle size={16}/>Surprise me</motion.button><motion.button whileTap={reduceMotion ? undefined : { scale: 0.97 }} type="button" onClick={()=>move(1)} disabled={facts.length<2} aria-label="Next flashcard" className="rounded-full border border-secondary/15 bg-white p-3 hover:bg-primary/20 disabled:opacity-40"><ArrowRight size={18}/></motion.button></div>
    </div>
  </div>;
}


function HeroFactCard({ fact }: { fact?: Fact }) {
  const [answerVisible, setAnswerVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  if (!fact) return <a href="#mini-games" onClick={event => { event.preventDefault(); document.getElementById('mini-games')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' }); }} className="block rounded-3xl bg-[#f7df86] p-8 text-2xl font-bold text-secondary">Ready for a challenge? Explore the mini games →</a>;
  return <div className="relative mx-auto w-full max-w-sm py-5">
    <div aria-hidden="true" className={`pointer-events-none absolute inset-5 rounded-3xl transition-transform duration-300 motion-reduce:transition-none ${answerVisible ? '-rotate-6 bg-[#f7df86]' : 'rotate-6 bg-[#68618c]'}`} />
    <motion.button whileTap={reduceMotion ? undefined : { scale: 0.97 }} type="button" onClick={() => setAnswerVisible(value => !value)} aria-pressed={answerVisible} aria-label={answerVisible ? 'Show the question again' : 'Reveal the answer'} className="relative block w-full cursor-pointer rounded-3xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary">
      <motion.span whileHover={reduceMotion ? undefined : { rotate: 0, y: -5 }} animate={{ rotate: reduceMotion ? 0 : answerVisible ? 2 : -3 }} transition={{ duration: reduceMotion ? 0 : 0.3 }} className={`grid min-h-[20rem] rounded-3xl border border-white/20 p-7 ${answerVisible ? 'bg-[#68618c] text-white' : 'bg-[#f7df86] text-secondary'}`}>
        <motion.span key={answerVisible ? 'answer' : 'question'} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="flex flex-col justify-between">
          <span className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest"><span>{answerVisible ? 'The answer' : 'A question for you'}</span><Sparkles size={18} className="shrink-0" /></span>
          <span className={`my-7 block ${answerVisible ? 'text-lg leading-relaxed' : 'text-2xl font-bold leading-snug'}`}>{answerVisible ? fact.answer : fact.question}</span>
          <span className="flex items-center gap-2 border-t border-current/20 pt-4 text-xs font-semibold"><RotateCcw size={15} />{answerVisible ? 'Tap to see the question again' : 'Tap this card to reveal the answer'}</span>
        </motion.span>
      </motion.span>
    </motion.button>
    <p role="status" aria-atomic="true" className="sr-only">{answerVisible ? fact.answer : fact.question}</p>
  </div>;
}

export default function FunPage() {
  const content=useCmsContent<FunContent>('fun',funContent);
  const [game,setGame]=useState('averages');
  const reduceMotion=useReducedMotion();
  const reveal={initial:reduceMotion?false as const:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:reduceMotion?0:0.45}};
  return <>
    <Helmet><title>Fun Stats — StatSoc</title><meta name="description" content="Flip a curiosity card, experiment with probability and play statistics mini games with StatSoc."/></Helmet>
    <main className="min-h-screen bg-[#fffdf5] text-secondary">
      <section className="relative overflow-hidden bg-secondary px-6 pb-16 pt-32 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full border-[50px] border-primary/10"/>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <motion.div {...reveal}><p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles size={16}/>A little less serious. Still statistical.</p><h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{content.heading}<span className="text-primary">.</span></h1><p className="mt-5 max-w-xl leading-relaxed text-white/65">{content.subheading}</p><div className="mt-7 flex flex-wrap gap-3"><a href="#flashcards" onClick={event => { event.preventDefault(); document.getElementById('flashcards')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' }); }} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-secondary hover:bg-white">Flip a fact <Layers size={17}/></a><a href="#mini-games" onClick={event => { event.preventDefault(); document.getElementById('mini-games')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' }); }} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Let’s play <Gamepad2 size={18}/></a></div></motion.div>
          <motion.div {...reveal} transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.15 }}><HeroFactCard fact={{ id: 'welcome', question: 'Are you interested in statistics?', answer: 'Already a stats fan or just here for a good time? Everyone’s welcome! Play a little, explore a little, and enjoy the fun side of statistics.' }} /></motion.div>
        </div>
      </section>
      <section id="flashcards" aria-labelledby="flashcards-heading" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-20"><motion.div {...reveal}><Flashcards facts={content.facts??[]}/></motion.div>{content.image&&<img src={content.image} alt={content.imageAlt||''} className="mx-auto mt-10 max-h-64 max-w-full rounded-2xl object-contain" loading="lazy"/>}</section>
      <section id="mini-games" aria-labelledby="games-heading" className="scroll-mt-24 border-y border-secondary/10 bg-[#f1f0f7] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl"><motion.div {...reveal} className="mb-9"><p className="mb-3 font-mono text-xs uppercase tracking-widest text-secondary/50">The mini-game arcade</p><h2 id="games-heading" className="text-3xl font-bold sm:text-4xl">Play with the possibilities.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary/65">No timer. No pressure. Pick a challenge and let the numbers surprise you.</p></motion.div>
          <div className="grid items-start gap-6 lg:grid-cols-[0.65fr_1.35fr]">
            <div className="flex flex-col gap-3" aria-label="Choose a statistics game">{gameOptions.map(({id,label,description,icon:Icon,colour},index)=><motion.button initial={reduceMotion ? false : { opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.08 }} whileHover={reduceMotion ? undefined : { x: 4 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} key={id} type="button" aria-pressed={game===id} aria-controls="active-game" onClick={()=>setGame(id)} className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-colors ${game===id?'border-secondary bg-secondary text-white':'border-secondary/10 bg-white hover:border-secondary/40'}`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-secondary ${colour}`}><Icon size={23}/></span><span className="min-w-0 flex-1"><span className={`font-mono text-[10px] ${game===id?'text-white/45':'text-secondary/40'}`}>0{index+1}</span><span className="block text-base font-bold">{label}</span><span className={`mt-1 block text-xs ${game===id?'text-white/65':'text-secondary/55'}`}>{description}</span></span><ArrowRight size={17} className="shrink-0"/></motion.button>)}<p className="px-2 pt-2 text-xs leading-relaxed text-secondary/50">Your progress stays here while you explore this page. Switch games to start a fresh challenge.</p></div>
            <motion.div id="active-game" key={game} initial={reduceMotion?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:0.25}} className="min-w-0 rounded-3xl border border-secondary/10 bg-white p-6 shadow-sm sm:p-8">{game==='averages'?<AverageGame/>:game==='chance'?<ProbabilityLab/>:<CorrelationGame/>}</motion.div>
          </div>
        </div>
      </section>
      <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-12"><div><h2 className="text-xl font-bold">Still curious? That’s a good sign.</h2><p className="mt-2 text-sm text-secondary/60">Revisit the cards. Try another experiment. There’s always another angle.</p></div><a href="#flashcards" onClick={event => { event.preventDefault(); document.getElementById('flashcards')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' }); }} className="inline-flex items-center gap-2 rounded-full border border-secondary/20 px-5 py-3 text-sm font-semibold hover:bg-primary/20">Back to the cards <ArrowDown size={16} className="rotate-180"/></a></section>
    </main>
  </>;
}
