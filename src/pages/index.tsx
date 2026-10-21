import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView } from 'motion/react';
import { ArrowDown, ChevronRight, Calendar, Briefcase, Sparkles, Users } from 'lucide-react';
import { home } from '@/content/home';
import { useEventsContent } from '@/lib/use-events-content';
import ScatterDots from '@/components/ScatterDots';

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onScrollPast }: { onScrollPast: () => void }) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        const newOpacity = Math.max(0, 1 - scrollY / 120);
        setOpacity(newOpacity);
        if (scrollY > 120) {
          setVisible(false);
          onScrollPast();
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollPast]);

  if (!visible) return null;

  const letters = 'StatSoc'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white overflow-hidden"
      style={{ opacity }}
      aria-hidden={!visible}
    >
      <ScatterDots count={30} />

      {/* Floating yellow shapes */}
      <motion.div
        className="absolute top-16 left-12 w-20 h-20 rounded-full"
        style={{ background: 'hsl(var(--primary)/0.25)' }}
        animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-24 right-16 w-32 h-32 rounded-3xl"
        style={{ background: 'hsl(var(--primary)/0.15)' }}
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-12 h-12 rounded-full"
        style={{ background: 'hsl(var(--accent)/0.3)' }}
        animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-1/3 left-16 w-8 h-8 rounded-full"
        style={{ background: 'hsl(var(--primary)/0.4)' }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Logo placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-6"
      >
        <img
          src="/airo-assets/images/logo/horizontal"
          alt="StatSoc Logo"
          className="h-16 w-auto object-contain"
        />
      </motion.div>

      {/* Animated letter stagger */}
      <div className="flex items-center gap-1 mb-4" aria-label="StatSoc">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + i * 0.07,
              ease: 'backOut' as const,
            }}
            className="text-6xl md:text-8xl font-extrabold"
            style={{ color: 'hsl(var(--secondary))' }}
          >
            {letter === 'S' && i === 4 ? (
              <span style={{ color: 'hsl(var(--primary))' }}>{letter}</span>
            ) : letter}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="text-lg md:text-xl text-muted-foreground font-medium mb-16 text-center px-6"
      >
        {home.splash.tagline}
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-sm font-semibold text-muted-foreground tracking-wide">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Data Graphic (hero right side) ──────────────────────────────────────────
function DataGraphic() {
  const dots = [
    { cx: 30, cy: 80 }, { cx: 55, cy: 65 }, { cx: 80, cy: 50 },
    { cx: 105, cy: 40 }, { cx: 130, cy: 25 }, { cx: 155, cy: 35 },
    { cx: 180, cy: 20 }, { cx: 45, cy: 90 }, { cx: 70, cy: 75 },
    { cx: 95, cy: 55 }, { cx: 120, cy: 45 }, { cx: 145, cy: 30 },
    { cx: 165, cy: 60 }, { cx: 190, cy: 45 }, { cx: 60, cy: 100 },
    { cx: 85, cy: 85 }, { cx: 110, cy: 70 }, { cx: 135, cy: 55 },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <motion.svg
        viewBox="0 0 220 120"
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Trend line */}
        <motion.path
          d="M 30 80 Q 80 50 130 30 T 190 20"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' as const }}
        />
        {/* Dots */}
        {dots.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={i % 3 === 0 ? 5 : 3.5}
            fill={i % 5 === 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
            opacity={i % 3 === 0 ? 1 : 0.6}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: i % 3 === 0 ? 1 : 0.6 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.04, ease: 'backOut' as const }}
          />
        ))}
        {/* Axis lines */}
        <line x1="20" y1="110" x2="200" y2="110" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <line x1="20" y1="10" x2="20" y2="110" stroke="hsl(var(--border))" strokeWidth="1.5" />
      </motion.svg>

      {/* Floating stat bubble */}
      <motion.div
        className="absolute -top-4 -right-4 px-3 py-2 rounded-2xl shadow-lg text-sm font-bold"
        style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' }}
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 3 }}
        transition={{ duration: 0.5, delay: 1.4, ease: 'backOut' as const }}
      >
        📈 Trending up!
      </motion.div>
      <motion.div
        className="absolute -bottom-2 -left-2 px-3 py-2 rounded-2xl shadow-lg text-sm font-bold"
        style={{ background: 'hsl(var(--secondary))', color: 'white' }}
        initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 0.5, delay: 1.6, ease: 'backOut' as const }}
      >
        σ = 0.42
      </motion.div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function FadeInSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
const eventImages = [
  '/airo-assets/images/pages/home/event-1',
  '/airo-assets/images/pages/home/event-2',
  '/airo-assets/images/pages/home/event-3',
];

const tagColors: Record<string, string> = {
  Networking: 'hsl(var(--primary))',
  Workshop: 'hsl(var(--accent))',
  Careers: 'hsl(var(--secondary))',
};

// ─── Nav Card Icons ───────────────────────────────────────────────────────────
const navIcons = [
  <Calendar size={28} />,
  <Briefcase size={28} />,
  <Sparkles size={28} />,
  <Users size={28} />,
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const eventContent = useEventsContent();
  const upcomingEvents = eventContent.events.length > 0 ? eventContent.events : home.events.items;

  return (
    <>
      <Helmet>
        <title>StatSoc — Statistics Society of the University of Sydney</title>
        <meta name="description" content="StatSoc is the University of Sydney's Statistics Society — welcoming students of all backgrounds to discover data, statistics, and community." />
        <link rel="canonical" href="https://statsoc.sydney.edu.au/" />
        <meta property="og:title" content="StatSoc — Statistics Society of the University of Sydney" />
        <meta property="og:description" content="Where data meets community. Join StatSoc for events, opportunities, and a love of statistics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://statsoc.sydney.edu.au/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Splash */}
      <SplashScreen onScrollPast={() => setSplashDone(true)} />

      {/* Spacer so content starts below splash */}
      <div className={`transition-opacity duration-500 ${splashDone ? 'opacity-100' : 'opacity-0'}`}>
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
          <ScatterDots count={20} color="hsl(var(--primary)/0.5)" />

          {/* Yellow blob background */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full rounded-bl-[80px] pointer-events-none"
            style={{ background: 'hsl(var(--muted))' }}
          />

          <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: 'hsl(var(--primary)/0.2)', color: 'hsl(var(--secondary))' }}
              >
                <span>🎓</span> University of Sydney
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
                style={{ color: 'hsl(var(--secondary))' }}
              >
                {home.hero.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' as const }}
                className="text-lg text-muted-foreground mb-8 max-w-lg"
              >
                {home.hero.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/membership"
                  className="px-8 py-3.5 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--secondary))',
                    boxShadow: '0 4px 16px hsl(var(--primary)/0.4)',
                  }}
                >
                  Join StatSoc
                </Link>
                <Link
                  to="/events"
                  className="px-8 py-3.5 rounded-full font-bold text-base border-2 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  style={{ borderColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary))' }}
                >
                  See Events <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>

            {/* Right — data graphic */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' as const }}
              className="flex justify-center"
            >
              <DataGraphic />
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <div
              className="max-w-4xl mx-auto mx-6 rounded-t-3xl px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6"
              style={{ background: 'hsl(var(--secondary))' }}
            >
              {home.hero.stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-2xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                    <span>{stat.value}</span>
                  </div>
                  <div className="text-xs font-medium text-white/70 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── INTRO ── */}
        <section className="py-xxl bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: 'hsl(var(--secondary))' }}>
                {home.intro.heading}
              </h2>
              {home.intro.body.map((para) => (
                <p key={para.id} className="text-muted-foreground text-lg leading-relaxed mb-4">
                  {para.text}
                </p>
              ))}
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 mt-4 font-bold text-base transition-all duration-200 hover:gap-3"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Become a member <ChevronRight size={18} />
              </Link>
            </FadeInSection>

            <FadeInSection delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="/airo-assets/images/pages/home/students-collab"
                  alt="StatSoc members collaborating"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                {/* Yellow accent corner */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ background: 'hsl(var(--primary))' }}
                />
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* ── EVENTS PREVIEW ── */}
        <section className="py-xxl" style={{ background: 'hsl(var(--muted))' }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeInSection className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--primary))' }}>
                  {home.events.subheading}
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
                  {home.events.heading}
                </h2>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 font-bold text-base shrink-0 transition-all duration-200 hover:gap-3"
                style={{ color: 'hsl(var(--secondary))' }}
              >
                See all events <ChevronRight size={18} />
              </Link>
            </FadeInSection>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingEvents.map((event, i) => (
                  <FadeInSection key={event.id} delay={i * 0.07}>
                    <Link to="/events" className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      <motion.article
                        className="group flex min-h-36 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-shadow"
                        whileHover={{ y: -3, boxShadow: '0 12px 30px hsl(var(--secondary)/0.12)' }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative min-h-36 w-28 shrink-0 overflow-hidden sm:w-36">
                          <img
                            src={('image' in event && event.image) || eventImages[i % eventImages.length]}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            width={144}
                            height={160}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/10" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                              <Calendar size={13} style={{ color: 'hsl(var(--primary))' }} /> {event.date}
                            </span>
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                              style={{ background: tagColors[event.tag] ?? 'hsl(var(--secondary))' }}
                            >
                              {event.tag}
                            </span>
                          </div>
                          <h3 className="mb-1.5 line-clamp-1 font-extrabold text-secondary sm:text-lg">{event.title}</h3>
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{event.description}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-secondary transition-colors group-hover:text-primary">
                            Event details <ChevronRight size={14} />
                          </span>
                        </div>
                      </motion.article>
                    </Link>
                  </FadeInSection>
                ))}
              </div>
            ) : (
              <FadeInSection>
                <div className="rounded-3xl border border-dashed border-border bg-white/70 px-6 py-10 text-center">
                  <Calendar className="mx-auto mb-3 text-primary" size={25} />
                  <p className="font-bold text-secondary">We’re planning what’s next</p>
                  <p className="mt-1 text-sm text-muted-foreground">Upcoming StatSoc events will appear here as soon as they’re announced.</p>
                </div>
              </FadeInSection>
            )}
          </div>
        </section>

        {/* ── NAV CARDS ── */}
        <section className="py-xxl bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <FadeInSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
                {home.navCards.heading}
              </h2>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {home.navCards.items.map((card, i) => (
                <FadeInSection key={card.id} delay={i * 0.08}>
                  <motion.div
                    className="relative rounded-3xl p-8 overflow-hidden cursor-pointer border-2 border-transparent"
                    style={{
                      background: i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
                      color: i % 2 === 0 ? 'white' : 'hsl(var(--secondary))',
                    }}
                    whileHover={{
                      scale: 1.02,
                      borderColor: 'hsl(var(--primary))',
                      boxShadow: '0 16px 48px hsl(var(--primary)/0.2)',
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={() => { window.location.href = card.href; }}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = card.href; }}
                    aria-label={`Explore ${card.title}`}
                  >
                    {/* Background scatter dots */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                      {[...Array(6)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute rounded-full"
                          style={{
                            width: 6 + j * 3,
                            height: 6 + j * 3,
                            right: `${10 + j * 12}%`,
                            top: `${20 + j * 10}%`,
                            background: 'hsl(var(--primary)/0.15)',
                          }}
                        />
                      ))}
                    </div>

                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'hsl(var(--primary))' }}
                    >
                      <span style={{ color: 'hsl(var(--secondary))' }}>
                        {navIcons[i]}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold mb-3">{card.title}</h3>
                    <p className={`text-base leading-relaxed ${i % 2 === 0 ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {card.description}
                    </p>

                    <div
                      className="inline-flex items-center gap-2 mt-6 font-bold text-sm"
                      style={{ color: 'hsl(var(--primary))' }}
                    >
                      Explore <ChevronRight size={16} />
                    </div>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <FadeInSection>
          <section
            className="py-20 relative overflow-hidden"
            style={{ background: 'hsl(var(--primary))' }}
          >
            <ScatterDots count={16} color="hsl(var(--secondary)/0.15)" />
            <div className="relative max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'hsl(var(--secondary))' }}>
                Ready to join the StatSoc family?
              </h2>
              <p className="text-lg mb-8" style={{ color: 'hsl(var(--secondary)/0.75)' }}>
                Membership is free through USU. Sign up in two minutes and unlock events, opportunities, and a community that loves data as much as you do.
              </p>
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'hsl(var(--secondary))',
                  color: 'white',
                  boxShadow: '0 8px 24px hsl(var(--secondary)/0.3)',
                }}
              >
                Join StatSoc — it's free!
              </Link>
            </div>
          </section>
        </FadeInSection>
      </div>
    </>
  );
}
