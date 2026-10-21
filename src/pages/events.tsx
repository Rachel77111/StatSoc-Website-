import { useState, useRef, type ReactNode } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView } from 'motion/react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Link } from 'react-router';
import { useEventsContent } from '@/lib/use-events-content';


const tagColours: Record<string, { bg: string; text: string }> = {
  Networking:  { bg: 'hsl(var(--primary))',   text: 'hsl(var(--secondary))' },
  Workshop:    { bg: 'hsl(var(--accent))',     text: '#fff' },
  Careers:     { bg: 'hsl(var(--secondary))', text: '#fff' },
  Social:      { bg: '#10B981',               text: '#fff' },
  Competition: { bg: '#8B5CF6',               text: '#fff' },
  Panel:       { bg: '#0EA5E9',               text: '#fff' },
};

const eventImages: Record<string, string> = {
  ev1: '/airo-assets/images/pages/events/careers',
  ev2: '/airo-assets/images/pages/events/workshop',
  ev3: '/airo-assets/images/pages/events/careers',
  ev4: '/airo-assets/images/pages/events/social',
  ev5: '/airo-assets/images/pages/events/competition',
  ev6: '/airo-assets/images/pages/events/panel',
};

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const eventRailRef = useRef<HTMLDivElement>(null);
  const content = useEventsContent();
  const { past_event_galleries } = content;
  const filteredEvents = activeFilter === 'all'
    ? content.events
    : content.events.filter((event) => event.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>Events — StatSoc</title>
        <meta name="description" content="Browse all StatSoc events — workshops, networking nights, careers fairs, and social events at the University of Sydney." />
        <link rel="canonical" href="https://statsoc.sydney.edu.au/events" />
        <meta property="og:title" content="Events — StatSoc" />
        <meta property="og:description" content="Workshops, networking nights, industry panels, social events, and more." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[...Array(18)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6 + (i % 4) * 4,
                  height: 6 + (i % 4) * 4,
                  left: `${(i * 17 + 5) % 95}%`,
                  top: `${(i * 23 + 10) % 85}%`,
                  background: 'hsl(var(--primary)/0.2)',
                }}
                animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4 + (i % 3), delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <img src="/airo-assets/images/pages/events/hero" alt="" className="w-full h-full object-cover" />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'hsl(var(--primary)/0.15)', color: 'hsl(var(--primary))' }}
            >
              <Calendar size={14} /> All Events
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-5"
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/70 max-w-2xl mx-auto"
            >
              {content.hero.subtitle}
            </motion.p>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
            {content.filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === f.value ? 'scale-105' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                style={activeFilter === f.value ? { background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' } : {}}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── UPCOMING EVENTS GALLERY ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-1 h-8 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
                  <h2 className="text-2xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>Upcoming Events</h2>
                </div>
                <p className="text-sm text-muted-foreground sm:ml-4">Find your next favourite thing to do with StatSoc.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => eventRailRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Scroll to previous events"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => eventRailRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Scroll to more events"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </FadeIn>

            {filteredEvents.length > 0 ? (
              <div
                ref={eventRailRef}
                className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Upcoming events"
              >
                {filteredEvents.map((event, i) => {
                  const colours = tagColours[event.tag] ?? tagColours.Networking;
                  const imgSrc = event.image ?? eventImages[event.id] ?? `/airo-assets/images/pages/home/event-${(i % 3) + 1}`;
                  return (
                    <motion.article
                      key={event.id}
                      className="group w-[min(84vw,350px)] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.28) }}
                      whileHover={{ y: -5, boxShadow: '0 18px 40px hsl(var(--secondary)/0.12)' }}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          width={600}
                          height={375}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold" style={{ background: colours.bg, color: colours.text }}>
                          {event.tag}
                        </span>
                        <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-semibold text-white">
                          <Calendar size={15} /> {event.date}
                        </span>
                        {event.featured && (
                          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-secondary">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 text-lg font-extrabold leading-snug text-secondary">{event.title}</h3>
                        <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><Clock size={13} />{event.time}</span>
                          <span className="inline-flex min-w-0 items-center gap-1.5"><MapPin size={13} className="shrink-0" /><span className="truncate">{event.location}</span></span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
                <Calendar className="mx-auto mb-3 text-primary" size={26} />
                <p className="font-bold text-secondary">New events are on the way</p>
                <p className="mt-1 text-sm text-muted-foreground">Check back soon for the next StatSoc get-together.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── PAST EVENTS ── */}
        <section className="py-16" style={{ background: 'hsl(var(--muted))' }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
                  <h2 className="text-2xl font-extrabold text-secondary">{content.pastHeading}</h2>
                </div>
                <p className="text-sm text-muted-foreground sm:ml-4">{content.pastSubheading}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">A look back</span>
            </FadeIn>

            {content.pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.pastEvents.map((event, i) => {
                const colours = tagColours[event.tag] ?? tagColours.Social;
                const gallery = past_event_galleries.find((g) => g.id === event.id);
                if (!gallery) return null;
                return (
                  <FadeIn key={event.id} delay={i * 0.07}>
                    <Link to={`/events/past/${gallery.slug}`} className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      <motion.article
                        className="h-full overflow-hidden rounded-3xl border border-border/70 bg-white shadow-sm"
                        whileHover={{ y: -5, boxShadow: '0 18px 40px hsl(var(--secondary)/0.12)' }}
                        transition={{ duration: 0.22 }}
                      >
                        <div className="grid h-52 grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden bg-white p-1.5 sm:h-60">
                          {gallery.photos.slice(0, 3).map((photo, photoIndex) => (
                            <motion.div
                              key={photo.id}
                              className={`relative overflow-hidden rounded-xl ${photoIndex === 0 ? 'col-span-2 row-span-2' : ''}`}
                              whileHover={{ scale: 1.025 }}
                              transition={{ duration: 0.35 }}
                            >
                              <img
                                src={photo.src}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                            </motion.div>
                          ))}
                          <div className="absolute sr-only">Event photo collage</div>
                        </div>
                        <div className="p-5">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: colours.bg, color: colours.text }}>
                              {event.tag}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <Calendar size={13} /> {event.date}
                            </span>
                          </div>
                          <h3 className="mb-4 text-lg font-extrabold leading-snug text-secondary">{event.title}</h3>
                          <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-bold text-secondary">
                            <span className="inline-flex items-center gap-2 text-primary">
                              <Images size={15} /> View photo gallery
                            </span>
                            <span className="text-muted-foreground">{gallery.photos.length} photos</span>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  </FadeIn>
                );
              })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-white/70 px-6 py-12 text-center">
                <Images className="mx-auto mb-3 text-primary" size={26} />
                <p className="font-bold text-secondary">Past event photos are coming soon</p>
                <p className="mt-1 text-sm text-muted-foreground">Event recaps and photo galleries will appear here.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <FadeIn>
          <section className="py-20 relative overflow-hidden" style={{ background: 'hsl(var(--primary))' }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 8 + i * 5,
                    height: 8 + i * 5,
                    left: `${(i * 19 + 3) % 90}%`,
                    top: `${(i * 31 + 5) % 80}%`,
                    background: 'hsl(var(--secondary)/0.1)',
                  }}
                />
              ))}
            </div>
            <div className="relative max-w-2xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'hsl(var(--secondary))' }}>
                {content.cta.heading}
              </h2>
              <p className="text-base mb-8" style={{ color: 'hsl(var(--secondary)/0.75)' }}>
                {content.cta.body}
              </p>
              <Link
                to="/newsletter"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{ background: 'hsl(var(--secondary))', color: 'white' }}
              >
                {content.cta.button} <ChevronRight size={16} />
              </Link>
            </div>
          </section>
        </FadeIn>
      </main>
    </>
  );
}
