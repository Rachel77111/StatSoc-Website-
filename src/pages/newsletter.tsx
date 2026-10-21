import { useRef, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView } from 'motion/react';
import { Calendar, Briefcase, BarChart2, BookOpen, ArrowRight, Mail, Quote, ExternalLink } from 'lucide-react';
import newsletterContent from '../../content/newsletter.json';
import { useCmsContent } from '@/lib/use-cms-content';

const iconMap: Record<string, React.ReactNode> = {
  Calendar:  <Calendar  size={22} />,
  Briefcase: <Briefcase size={22} />,
  BarChart2: <BarChart2 size={22} />,
  BookOpen:  <BookOpen  size={22} />,
};

const tagColours: Record<string, { bg: string; text: string }> = {
  Social:     { bg: '#10B981', text: '#fff' },
  Workshop:   { bg: 'hsl(var(--accent))', text: '#fff' },
  Networking: { bg: 'hsl(var(--primary))', text: 'hsl(var(--secondary))' },
  Careers:    { bg: 'hsl(var(--secondary))', text: '#fff' },
};

type NewsletterIssue = { id: string; tag: string; date: string; title: string; preview: string; href?: string };
type NewsletterQuote = { id: string; text: string; name: string; year: string };
type NewsletterContent = Omit<typeof newsletterContent, 'socialProof' | 'archive'> & {
  socialProof: { heading: string; quotes: NewsletterQuote[] };
  archive: { heading: string; description: string; issues: NewsletterIssue[] };
};

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

export default function NewsletterPage() {
  const newsletter = useCmsContent<NewsletterContent>('newsletter', newsletterContent);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <>
      <Helmet>
        <title>Newsletter — StatSoc</title>
        <meta name="description" content={newsletter.hero.subtitle} />
        <link rel="canonical" href="https://statsoc.sydney.edu.au/newsletter" />
        <meta property="og:title" content="Newsletter — StatSoc" />
        <meta property="og:description" content={newsletter.hero.subtitle} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
          {/* Ambient dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 + (i % 5) * 4,
                  height: 4 + (i % 5) * 4,
                  left: `${(i * 17 + 5) % 95}%`,
                  top: `${(i * 23 + 9) % 90}%`,
                  background: 'hsl(var(--primary)/0.12)',
                }}
                animate={{ y: [0, -12, 0], opacity: [0.12, 0.35, 0.12] }}
                transition={{ duration: 4 + (i % 4), delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Envelope icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="relative flex justify-center mb-8"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'hsl(var(--primary))' }}
            >
              <Mail size={30} style={{ color: 'hsl(var(--secondary))' }} />
            </div>
          </motion.div>

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight"
            >
              {newsletter.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
            >
              {newsletter.hero.subtitle}
            </motion.p>
          </div>
        </section>

        {/* ── SUBSCRIBE FORM ── */}
        <section className="py-20" style={{ background: 'hsl(var(--background))' }}>
          <FadeIn className="max-w-xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'hsl(var(--secondary))' }}>
              {newsletter.subscribeSection.heading}
            </h2>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              {newsletter.subscribeSection.description}
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-8 border-2"
                style={{ borderColor: 'hsl(var(--primary))', background: 'hsl(var(--primary)/0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'hsl(var(--primary))' }}
                >
                  <Mail size={22} style={{ color: 'hsl(var(--secondary))' }} />
                </div>
                <p className="font-bold text-lg mb-1" style={{ color: 'hsl(var(--secondary))' }}>{newsletter.subscribeSection.successHeading}</p>
                <p className="text-muted-foreground text-sm">{newsletter.subscribeSection.successBody}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.subscribeSection.emailPlaceholder}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  aria-label="Email address"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' }}
                >
                  {newsletter.subscribeSection.buttonLabel} <ArrowRight size={15} />
                </motion.button>
              </form>
            )}

            <p className="text-muted-foreground text-xs mt-4">{newsletter.subscribeSection.privacyNote}</p>
          </FadeIn>
        </section>

        {/* ── WHAT'S INSIDE ── */}
        <section className="py-20" style={{ background: 'hsl(var(--muted))' }}>
          <FadeIn className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1 h-8 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
              <h2 className="text-2xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
                {newsletter.whatsInside.heading}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {newsletter.whatsInside.items.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.08}>
                  <div className="bg-background rounded-2xl p-6 border border-border hover:shadow-md transition-shadow duration-200">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'hsl(var(--primary)/0.12)', color: 'hsl(var(--secondary))' }}
                    >
                      {iconMap[item.icon]}
                    </div>
                    <h3 className="font-bold text-base mb-1.5" style={{ color: 'hsl(var(--secondary))' }}>
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-20" style={{ background: 'hsl(var(--background))' }}>
          <FadeIn className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1 h-8 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
              <h2 className="text-2xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
                {newsletter.socialProof.heading}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsletter.socialProof.quotes.map((quote, i) => (
                <FadeIn key={quote.id} delay={i * 0.1}>
                  <div
                    className="rounded-2xl p-7 border relative overflow-hidden"
                    style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--muted))' }}
                  >
                    <Quote
                      size={40}
                      className="absolute top-4 right-5 opacity-10"
                      style={{ color: 'hsl(var(--primary))' }}
                    />
                    <p className="text-sm leading-relaxed mb-5 relative z-10" style={{ color: 'hsl(var(--secondary))' }}>
                      {quote.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' }}
                      >
                        {quote.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'hsl(var(--secondary))' }}>{quote.name}</p>
                        <p className="text-muted-foreground text-xs">{quote.year}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── ARCHIVE ── */}
        <section className="py-20" style={{ background: 'hsl(var(--muted))' }}>
          <FadeIn className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1 h-8 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
              <h2 className="text-2xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
                {newsletter.archive.heading}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-8 ml-4">{newsletter.archive.description}</p>

            <div className="flex flex-col gap-3">
              {newsletter.archive.issues.map((issue, i) => {
                const colours = tagColours[issue.tag] ?? tagColours.Social;
                return (
                  <FadeIn key={issue.id} delay={i * 0.06}>
                    <div className="bg-background rounded-2xl px-6 py-5 border border-border flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow duration-200 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: colours.bg, color: colours.text }}
                          >
                            {issue.tag}
                          </span>
                          <span className="text-muted-foreground text-xs">{issue.date}</span>
                        </div>
                        <h3 className="font-bold text-sm mb-1" style={{ color: 'hsl(var(--secondary))' }}>
                          {issue.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{issue.preview}</p>
                      </div>
                      <a href={issue.href}
                        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5"
                        style={{ color: 'hsl(var(--primary))' }}
                      >
                        <ExternalLink size={13} />
                        <span>{newsletter.labels.readIssue}</span>
                      </a>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </FadeIn>
        </section>

        {/* ── BOTTOM CTA ── */}
        <FadeIn>
          <section
            className="py-20 text-center relative overflow-hidden"
            style={{ background: 'hsl(var(--secondary))' }}
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 6 + (i % 3) * 5,
                    height: 6 + (i % 3) * 5,
                    left: `${(i * 23 + 10) % 90}%`,
                    top: `${(i * 31 + 15) % 80}%`,
                    background: 'hsl(var(--primary)/0.15)',
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="relative max-w-lg mx-auto px-6">
              <h2 className="text-3xl font-extrabold text-white mb-3">{newsletter.bottomCta.heading}</h2>
              <p className="text-white/55 text-sm mb-8">{newsletter.bottomCta.body}</p>
              <motion.a
                href={newsletter.bottomCta.href}
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg cursor-pointer"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' }}
              >
                {newsletter.bottomCta.button} <ArrowRight size={15} />
              </motion.a>
            </div>
          </section>
        </FadeIn>
      </main>
    </>
  );
}
