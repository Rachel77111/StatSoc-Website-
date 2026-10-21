import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { past_event_galleries } from '@/content/events';

const tagColours: Record<string, { bg: string; text: string }> = {
  Social:      { bg: '#10B981', text: '#fff' },
  Workshop:    { bg: 'hsl(var(--accent))', text: '#fff' },
  Networking:  { bg: 'hsl(var(--primary))', text: 'hsl(var(--secondary))' },
  Careers:     { bg: 'hsl(var(--secondary))', text: '#fff' },
  Competition: { bg: '#8B5CF6', text: '#fff' },
  Panel:       { bg: '#0EA5E9', text: '#fff' },
};

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GalleryView({ eventIndex }: { eventIndex: number }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photoCount = past_event_galleries[eventIndex].photos.length;

  const handleKey = useCallback((e: WindowEventMap['keydown']) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape')     setLightboxIndex(null);
    if (e.key === 'ArrowRight') setLightboxIndex((i) => i !== null ? (i + 1) % photoCount : null);
    if (e.key === 'ArrowLeft')  setLightboxIndex((i) => i !== null ? (i - 1 + photoCount) % photoCount : null);
  }, [lightboxIndex, photoCount]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const colours = tagColours[past_event_galleries[eventIndex].tag] ?? tagColours.Social;

  return (
    <>
      <Helmet>
        <title>{past_event_galleries[eventIndex].title} — StatSoc</title>
        <meta name="description" content={past_event_galleries[eventIndex].description} />
        <link rel="canonical" href={`https://statsoc.sydney.edu.au/events/past/${past_event_galleries[eventIndex].slug}`} />
        <meta property="og:title" content={`${past_event_galleries[eventIndex].title} — StatSoc`} />
        <meta property="og:description" content={past_event_galleries[eventIndex].description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 5 + (i % 4) * 4,
                  height: 5 + (i % 4) * 4,
                  left: `${(i * 19 + 7) % 94}%`,
                  top: `${(i * 27 + 8) % 88}%`,
                  background: 'hsl(var(--primary)/0.15)',
                }}
                animate={{ y: [0, -10, 0], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 4 + (i % 3), delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-all duration-200 hover:gap-3"
                style={{ color: 'hsl(var(--primary))' }}
              >
                <ArrowLeft size={15} /> Back to Events
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: colours.bg, color: colours.text }}>
                {past_event_galleries[eventIndex].tag}
              </span>
              <span className="flex items-center gap-1.5 text-white/50 text-sm">
                <Calendar size={13} />{past_event_galleries[eventIndex].date}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
            >
              {past_event_galleries[eventIndex].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-white/65 text-base leading-relaxed max-w-2xl"
            >
              A few moments from the day, captured by the StatSoc community.
            </motion.p>
          </div>
        </section>

        {/* ── GALLERY HEADER ── */}
        <FadeIn className="max-w-4xl mx-auto px-6 pt-14 pb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-8 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
            <div>
              <h2 className="text-2xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>Event Gallery</h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {past_event_galleries[eventIndex].photos.length} moments — select a photo to explore the gallery
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── MASONRY GALLERY ── */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
            {past_event_galleries[eventIndex].photos.map((photo, i) => (
              <FadeIn key={photo.id} delay={i * 0.08} className="break-inside-avoid">
                <motion.button
                  onClick={() => setLightboxIndex(i)}
                  className="group relative w-full overflow-hidden rounded-2xl block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.24) }}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  aria-label={`View photo: ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      photo.span === 'wide' ? 'aspect-[16/9]' :
                      photo.span === 'tall' ? 'aspect-[3/4]'  :
                      'aspect-square'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-all duration-300 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--primary))' }}>
                        <ZoomIn size={18} style={{ color: 'hsl(var(--secondary))' }} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── BACK CTA ── */}
        <FadeIn>
          <section className="py-16 text-center" style={{ background: 'hsl(var(--muted))' }}>
            <p className="text-muted-foreground mb-5 text-sm">Want to see what's coming up next?</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ background: 'hsl(var(--secondary))', color: 'white' }}
            >
              <ArrowLeft size={15} /> Back to all events
            </Link>
          </section>
        </FadeIn>
      </main>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'hsl(var(--lightbox-overlay) / 0.93)' }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={22} className="text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i !== null ? (i - 1 + photoCount) % photoCount : null); }}
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} className="text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i !== null ? (i + 1) % photoCount : null); }}
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight size={26} className="text-white" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              className="relative max-w-4xl w-full mx-14 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={past_event_galleries[eventIndex].photos[lightboxIndex].src}
                alt={past_event_galleries[eventIndex].photos[lightboxIndex].alt}
                className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <div className="mt-4 flex items-center gap-4">
                <p className="text-white/70 text-sm">{past_event_galleries[eventIndex].photos[lightboxIndex].alt}</p>
                <span className="text-white/40 text-xs">{lightboxIndex + 1} / {photoCount}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {past_event_galleries[eventIndex].photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === lightboxIndex ? 20 : 6,
                      height: 6,
                      background: i === lightboxIndex ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.25)',
                    }}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function PastEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const matchIndex = past_event_galleries.findIndex((e) => e.slug === slug);

  if (matchIndex === -1) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Event not found.</p>
        <Link to="/events" className="text-sm font-semibold underline" style={{ color: 'hsl(var(--primary))' }}>
          Back to Events
        </Link>
      </main>
    );
  }

  return <GalleryView eventIndex={matchIndex} />;
}
