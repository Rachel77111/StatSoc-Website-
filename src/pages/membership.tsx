import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import { membership } from '@/content/membership';

const steps = [
  {
    title: 'Visit the USU website',
    shortTitle: 'Visit USU',
    icon: ExternalLink,
    image: '/images/membership-steps/visit-usu.svg',
    imageAlt: 'Illustration of a student opening the USU website on a laptop',
    body: 'Go to usu.edu.au and select the account icon in the top-right corner, then choose Login.',
    action: 'Open usu.edu.au',
    href: 'https://usu.edu.au/',
  },
  {
    title: 'Log in to your USU account',
    shortTitle: 'Log in',
    icon: CircleUserRound,
    image: '/images/membership-steps/login.svg',
    imageAlt: 'Illustration of signing in to a student account using a verification code',
    body: "Enter your mobile number or USU member ID, then verify your identity with the code sent to you. New to USU? Choose Join USU to register first.",
  },
  {
    title: 'Access the Clubs platform',
    shortTitle: 'Clubs',
    icon: ExternalLink,
    image: '/images/membership-steps/clubs.svg',
    imageAlt: 'Illustration of navigating from the USU site to its clubs platform',
    body: 'Open the Clubs section and select Proceed to MyUSU. You will be redirected to the USU clubs platform.',
  },
  {
    title: 'Find StatSoc',
    shortTitle: 'Find StatSoc',
    icon: Search,
    image: '/images/membership-steps/find-statsoc.svg',
    imageAlt: 'Illustration of searching for The University of Sydney Statistics Society',
    body: 'Open Groups and search for “The University of Sydney Statistics Society”. Select StatSoc in the results to open our society profile.',
  },
  {
    title: 'Join the society',
    shortTitle: 'Join group',
    icon: CheckCircle2,
    image: '/images/membership-steps/join-group.svg',
    imageAlt: 'Illustration of choosing a membership option and joining a student society',
    body: 'On the StatSoc profile, click Join Group. Choose the available membership option from the dropdown, then click Join to continue.',
  },
  {
    title: 'Confirm your membership',
    shortTitle: 'Confirm',
    icon: ShieldCheck,
    image: '/images/membership-steps/confirmation.svg',
    imageAlt: 'Illustration showing a successful membership confirmation',
    body: 'Follow the prompts to confirm your details and complete registration. When you see “Thanks for joining!”, you are officially a StatSoc member!',
  },
];

// MP4 version of the uploaded walkthrough for consistent browser support.
const membershipVideo = {
  title: 'How to join StatSoc through USU',
  src: '/videos/membership-guide.mp4',
  type: 'video/mp4',
};

export default function MembershipPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const step = steps[activeStep];
  const progress = Math.round((completedSteps.length / steps.length) * 100);

  const toggleComplete = (stepIndex: number) => {
    setCompletedSteps((current) => current.includes(stepIndex)
      ? current.filter((item) => item !== stepIndex)
      : [...current, stepIndex]);
  };

  return (
    <>
      <Helmet>
        <title>Join StatSoc — Membership</title>
        <meta name="description" content="Follow the step-by-step guide to join StatSoc through the University of Sydney Union (USU). Membership is free." />
        <link rel="canonical" href="https://statsoc.sydney.edu.au/membership" />
      </Helmet>

      <main className="overflow-hidden">
        <section className="relative overflow-hidden bg-secondary pb-16 pt-32 sm:pb-20 sm:pt-36">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 sm:h-80 sm:w-80" />
          <div className="pointer-events-none absolute -bottom-32 left-[-3rem] h-64 w-64 rounded-full bg-primary/10" />
          <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm"
            >
              <Sparkles size={15} /> Free USU membership
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-balance text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              {membership.heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              {membership.subheading} Follow the guide below and you’ll be part of our community in just a few steps.
            </motion.p>
            <motion.a
              href="https://usu.edu.au/"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-secondary shadow-lg shadow-black/10 sm:px-7 sm:text-base"
            >
              Start at USU <ArrowRight size={17} />
            </motion.a>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/55 sm:text-sm">
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-primary" /> No-cost membership</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-primary" /> About 2 minutes</span>
              <span className="inline-flex items-center gap-2"><Check size={15} className="text-primary" /> Open to all students</span>
            </div>
          </div>
        </section>

        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Your quick-start guide</p>
                <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">How to join StatSoc</h2>
              </div>
              <div className="w-full sm:max-w-52">
                <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Your progress</span><span>{completedSteps.length} of {steps.length} complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Membership guide progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
                </div>
              </div>
            </div>

            <div className="mb-5 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mb-7 sm:overflow-visible sm:px-0">
              <div className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-3 lg:grid-cols-6">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeStep;
                  const isDone = completedSteps.includes(index);
                  return (
                    <button
                      key={item.shortTitle}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`group flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all sm:min-h-24 sm:flex-col sm:items-start sm:justify-between sm:p-3 ${isActive ? 'border-secondary bg-secondary text-white shadow-md' : 'border-border bg-white text-secondary hover:border-primary'}`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${isActive ? 'bg-primary text-secondary' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-secondary'}`}>
                        {isDone ? <Check size={14} /> : index + 1}
                      </span>
                      <span className="text-xs font-bold sm:text-left">{item.shortTitle}</span>
                      <Icon size={15} className={`hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-sm md:grid-cols-[0.75fr_1.25fr]"
              >
                <div className="relative min-h-56 overflow-hidden bg-muted sm:min-h-64 md:min-h-full">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={step.image}
                      src={step.image}
                      alt={step.imageAlt}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-secondary shadow-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">{activeStep + 1}</span>
                    Step {activeStep + 1} of {steps.length}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary">Step {activeStep + 1}</p>
                  <h3 className="text-2xl font-extrabold leading-tight text-secondary sm:text-3xl">{step.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{step.body}</p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {step.href && (
                      <a href={step.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-secondary transition-transform hover:-translate-y-0.5">
                        {step.action} <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleComplete(activeStep)}
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${completedSteps.includes(activeStep) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-border text-secondary hover:border-primary'}`}
                    >
                      <CheckCircle2 size={16} /> {completedSteps.includes(activeStep) ? 'Step completed' : 'Mark step complete'}
                    </button>
                    {activeStep < steps.length - 1 && (
                      <button type="button" onClick={() => setActiveStep((current) => current + 1)} className="inline-flex min-h-11 items-center justify-center gap-1 text-sm font-bold text-secondary transition-colors hover:text-primary">
                        Next step <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section className="bg-muted py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-7 max-w-2xl">
              <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">Membership video guide</h2>
            </div>
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
            >
              {!videoUnavailable ? (
                <video
                  className="aspect-video w-full bg-secondary object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={membershipVideo.title}
                  onError={() => setVideoUnavailable(true)}
                >
                  <source src={membershipVideo.src} type={membershipVideo.type} />
                  Your browser does not support embedded videos.
                </video>
              ) : (
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-secondary">
                  <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-primary/15" />
                  <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full bg-accent/15" />
                  <div className="relative flex flex-col items-center px-6 text-center">
                    <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-secondary"><Video size={26} /></span>
                    <span className="text-sm font-extrabold text-white">Video unavailable</span>
                  </div>
                </div>
              )}
            </motion.article>
          </div>
        </section>
        </main>
    </>
  );
}
