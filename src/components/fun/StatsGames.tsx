import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ArrowRight, RotateCcw, Sparkles, Shuffle } from 'lucide-react';
import { mean, median, correlation, sampleGold } from '@/lib/stats-games';

const action = 'inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/80 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary';
const pill = 'rounded-full border border-secondary/15 px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
function Feedback({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} role="status" className={`mt-5 rounded-2xl p-5 text-sm leading-relaxed ${correct ? 'bg-[#e0efdf]' : 'bg-[#fff0d6]'}`}>{children}</motion.div>;
}

export function AverageGame() {
  const reduceMotion = useReducedMotion();
  const [round, setRound] = useState(1);
  const [numbers, setNumbers] = useState([2, 4, 5, 7, 22]);
  const [metric, setMetric] = useState<'mean' | 'median'>('median');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const target = metric === 'mean' ? mean(numbers) : median(numbers);
  const rounded = Math.round(target * 10) / 10;
  const correct = answer.trim() !== '' && Number.isFinite(Number(answer)) && Math.abs(Number(answer) - rounded) < 0.001;
  function next(restart = false) {
    setRound(restart ? 1 : round + 1);
    if (restart) setScore(0);
    setNumbers(Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1));
    setMetric(Math.random() > 0.5 ? 'mean' : 'median');
    setAnswer(''); setSubmitted(false);
  }
  return <div>
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-primary/25 px-3 py-1 text-xs font-bold">QUICK THINKING</span><p className="text-sm text-secondary/60">Round {round} / 5 · {score} correct</p></div>
    <h3 className="text-2xl font-bold sm:text-3xl">Find the {metric}.</h3><p className="mt-3 text-sm text-secondary/65">Five numbers. One answer. Round to one decimal place if needed.</p>
    <div aria-label={`Numbers: ${numbers.join(', ')}`} className="my-8 flex flex-wrap justify-center gap-3">{numbers.map((number, i) => <motion.span key={`${round}-${i}`} initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.25, delay: reduceMotion ? 0 : i * 0.045 }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/30 font-mono text-2xl font-bold sm:h-16 sm:w-16">{number}</motion.span>)}</div>
    <form onSubmit={event => { event.preventDefault(); if (submitted || !answer.trim()) return; setSubmitted(true); if (correct) setScore(score + 1); }}>
      <label htmlFor="average-answer" className="mb-2 block text-sm font-semibold">Your answer</label><div className="flex flex-wrap gap-3"><input id="average-answer" type="number" step="any" required value={answer} disabled={submitted} onChange={event => setAnswer(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-secondary/20 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Take a guess…" /><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} className={action} disabled={submitted || !answer.trim()}>Check answer <Check size={16} /></motion.button></div>
    </form>
    {submitted && <Feedback correct={correct}><strong>{correct ? 'You got it!' : `The answer is ${rounded}.`}</strong><p className="mt-2">{metric === 'mean' ? `Add all five numbers (${numbers.reduce((a,b) => a+b,0)}), then divide by 5.` : `Sort them: ${[...numbers].sort((a,b)=>a-b).join(', ')}. The middle number is ${rounded}.`}</p>{round === 5 ? <><p className="mt-3 font-semibold">Challenge complete: {score} / 5. {score === 5 ? 'A perfect set!' : 'Every round is a chance to learn.'}</p><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" onClick={()=>next(true)} className={`${action} mt-4`}>Play again <RotateCcw size={16} /></motion.button></> : <motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" onClick={()=>next()} className={`${action} mt-4`}>Next round <ArrowRight size={16} /></motion.button>}</Feedback>}
    <details className="mt-6 text-sm"><summary className="w-fit cursor-pointer font-semibold underline underline-offset-4">Need a hint?</summary><p className="mt-3 text-secondary/65">Mean: add everything and divide by the count. Median: sort first, then find the middle. A very large number can pull the mean up!</p></details>
  </div>;
}

export function ProbabilityLab() {
  const reduceMotion = useReducedMotion();
  const [draws, setDraws] = useState(0), [gold, setGold] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [lastBatch, setLastBatch] = useState(0);
  function draw(count: number) { setGold(value => value + sampleGold(count, 0.3)); setDraws(value => value + count); setLastBatch(count); }
  const observed = draws ? gold / draws * 100 : 0;
  return <div>
    <span className="rounded-full bg-[#dedfea] px-3 py-1 text-xs font-bold">CHANCE LAB</span><h3 className="mt-6 text-2xl font-bold sm:text-3xl">Can you trust your luck?</h3><p className="mt-3 text-sm leading-relaxed text-secondary/65">A bag holds 3 gold and 7 purple tokens. Draw one, put it back, and repeat. What’s the chance of gold on each draw?</p>
    <div className="my-7 flex flex-wrap justify-center gap-2" aria-label="3 gold tokens and 7 purple tokens">{Array.from({length:10},(_,i)=><span key={i} aria-hidden="true" className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${i<3?'bg-primary text-secondary':'bg-[#68618c] text-white'}`}>{i<3?'G':'P'}</span>)}</div>
    <div className="flex flex-wrap items-center gap-3">{[10,30,50,70].map(value=><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" key={value} disabled={checked} aria-pressed={guess===value} onClick={()=>setGuess(value)} className={`${pill} ${guess===value?'bg-secondary text-white':'bg-white'}`}>{value}%</motion.button>)}<motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" disabled={guess===null || checked} onClick={()=>setChecked(true)} className={action}>Lock it in</motion.button></div>
    {checked && <><Feedback correct={guess===30}><strong>{guess===30?'Exactly!':'It’s 30%: 3 gold tokens out of 10.'}</strong><p className="mt-2">Now run an experiment. Each simulated draw is independent and the token is replaced.</p></Feedback><div className="mt-6 flex flex-wrap gap-2">{[10,100,1000].map(count=><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" key={count} className={action} onClick={()=>draw(count)}>Draw {count.toLocaleString()}</motion.button>)}</div></>}
    <div className="mt-7 rounded-2xl bg-secondary/5 p-5" aria-live="polite"><div className="mb-5 grid grid-cols-2 gap-3"><div><motion.p key={draws} initial={reduceMotion ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="origin-left font-mono text-3xl font-bold">{draws.toLocaleString()}</motion.p><p className="text-xs text-secondary/55">total draws</p></div><div><p className="font-mono text-3xl font-bold">{gold.toLocaleString()}</p><p className="text-xs text-secondary/55">gold tokens drawn</p></div></div><div className="mb-2 flex justify-between text-sm"><span>Observed gold rate</span><strong>{draws?`${observed.toFixed(1)}%`:'—'}</strong></div><div className="relative h-4 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none" style={{width:`${observed}%`}} /><span className="absolute inset-y-0 left-[30%] border-l-2 border-secondary" /></div><p className="mt-2 text-xs text-secondary/60">Marker: theoretical 30%. {lastBatch>0?`Last batch: ${lastBatch.toLocaleString()} draws.`:''}</p></div>
    <p className="mt-4 text-sm leading-relaxed text-secondary/65">More draws tend to bring the proportion closer to 30%, but randomness means it won’t improve every time.</p><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" onClick={()=>{setDraws(0);setGold(0);setGuess(null);setChecked(false);setLastBatch(0);}} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"><RotateCcw size={15} />Reset experiment</motion.button>
  </div>;
}

const plots = [
  { points:[2,3,3,5,5,6,6,8,8,9], answer:'Positive', explanation:'As x increases, y generally increases. That’s a positive linear association.' },
  { points:[9,9,7,8,6,5,5,3,2,2], answer:'Negative', explanation:'As x increases, y generally decreases. That’s a negative linear association.' },
  { points:[8,2,5,1,9,9,1,5,2,8], answer:'No clear linear pattern', explanation:'The high and low values are balanced across x, so there is no clear linear association.' },
  { points:[9,5,3,2,1,1,2,3,5,9], answer:'No clear linear pattern', explanation:'This U-shaped pattern has a relationship, but it isn’t linear. A correlation near zero does not mean no relationship!' },
];
export function CorrelationGame() {
  const reduceMotion = useReducedMotion();
  const [round,setRound]=useState(0),[choice,setChoice]=useState(''),[score,setScore]=useState(0);
  const plot=plots[round], points=plot.points.map((y,x)=>({x:x+1,y}));
  const correct=choice===plot.answer;
  return <div><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-[#dcece2] px-3 py-1 text-xs font-bold">PATTERN DETECTIVE</span><span className="text-sm text-secondary/60">Plot {round+1} / {plots.length} · {score} correct</span></div><h3 className="mt-6 text-2xl font-bold sm:text-3xl">Spot the correlation.</h3><p className="mt-3 text-sm text-secondary/65">What kind of linear association do these points suggest?</p>
    <svg viewBox="0 0 420 240" role="img" aria-label={`Scatter plot. For increasing x values 1 to 10, y values are ${plot.points.join(', ')}.`} className="my-6 w-full rounded-2xl bg-[#f6f5f9]">{[1,3,5,7,9].map(y=><line key={y} x1="40" x2="390" y1={210-y*18} y2={210-y*18} stroke="#dedde5" />)}<path d="M40 20 V210 H395" fill="none" stroke="#686179" /><text x="397" y="230" fontSize="12" fill="#686179">x</text><text x="19" y="20" fontSize="12" fill="#686179">y</text>{points.map(p=><motion.circle key={`${round}-${p.x}`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : p.x * 0.035 }} cx={40+p.x*33} cy={210-p.y*18} r="7" fill="#68618c" stroke="white" strokeWidth="2" />)}</svg>
    <div className="flex flex-wrap gap-2">{['Positive','Negative','No clear linear pattern'].map(value=><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} key={value} type="button" disabled={!!choice} aria-pressed={choice===value} onClick={()=>{setChoice(value);if(value===plot.answer)setScore(score+1);}} className={`${pill} ${choice===value?'bg-secondary text-white':'bg-white'}`}>{value}</motion.button>)}</div>
    {choice && <Feedback correct={correct}><strong>{correct?'Nice detective work!':`Answer: ${plot.answer}.`}</strong><p className="mt-2">{plot.explanation}</p><p className="mt-2 font-mono">Pearson r = {correlation(points).toFixed(2)}</p>{round===plots.length-1?<><p className="mt-3 font-semibold">Case closed: {score} / {plots.length} correct.</p><motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} className={`${action} mt-4`} type="button" onClick={()=>{setRound(0);setChoice('');setScore(0);}}>Play again <RotateCcw size={16} /></motion.button></>:<motion.button whileTap={reduceMotion ? undefined : { scale: 0.96 }} type="button" className={`${action} mt-4`} onClick={()=>{setRound(round+1);setChoice('');}}>Next plot <ArrowRight size={16} /></motion.button>}</Feedback>}
    <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-secondary/60"><Sparkles size={15} className="shrink-0" />These are illustrative datasets. Correlation alone does not establish causation.</p>
  </div>;
}

export const gameOptions = [
  { id:'averages',label:'Average artist',icon:Sparkles,description:'Find the middle. Beat the outlier.',colour:'bg-[#f7df86]' },
  { id:'chance',label:'Chance lab',icon:Shuffle,description:'Put probability to the test.',colour:'bg-[#dedfea]' },
  { id:'patterns',label:'Pattern detective',icon:SearchIcon,description:'Read between the data points.',colour:'bg-[#dcece2]' },
];
function SearchIcon({size=24}:{size?:number}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>;}
