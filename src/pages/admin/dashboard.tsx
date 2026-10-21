import { useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { BarChart2, LogOut, Users, Calendar, Mail, ExternalLink, Shield } from 'lucide-react';
import { useSession, authClient } from '@/lib/auth/auth-client';
import { admin_dashboard } from '@/content/admin';

export default function AdminDashboard() {
  const { session, isPending, isAuthenticated } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isPending]);

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = '/admin/login';
  }

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--secondary))' }}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) return null;

  const quickLinks = [
    { label: 'Edit Homepage',      href: '/',             icon: <BarChart2 size={18} /> },
    { label: 'Edit Events',        href: '/events',        icon: <Calendar size={18} /> },
    { label: 'Edit Newsletter',    href: '/newsletter',    icon: <Mail size={18} /> },
    { label: 'Edit Opportunities', href: '/opportunities', icon: <ExternalLink size={18} /> },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — StatSoc</title>
        <meta name="description" content="StatSoc executive admin dashboard. Restricted access only." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen" style={{ background: 'hsl(var(--muted))' }}>

        {/* Top bar */}
        <header className="sticky top-0 z-40 shadow-sm" style={{ background: 'hsl(var(--secondary))' }}>
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'hsl(var(--primary))' }}>
                <BarChart2 size={16} style={{ color: 'hsl(var(--secondary))' }} />
              </div>
              <span className="font-extrabold text-white text-sm">StatSoc Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-xs hidden sm:block">
                {session?.user.name ?? session?.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10"
                style={{ color: 'hsl(var(--primary))' }}
              >
                <LogOut size={13} /> <span>{admin_dashboard.signOut}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }} className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'hsl(var(--primary))' }}>
                <span>{admin_dashboard.eyebrow}</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: 'hsl(var(--secondary))' }}>
              <span>{admin_dashboard.welcomePrefix}</span>{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              <span>{admin_dashboard.signedInPrefix}</span> <span className="font-semibold">{session?.user.email}</span>
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' as const }} className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
              <span>{admin_dashboard.quickLinksHeading}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map((link) => (
                <a key={link.href} href={link.href}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:shadow-md transition-all duration-200 group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{ background: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--secondary))' }}>
                    {link.icon}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: 'hsl(var(--secondary))' }}>
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' as const }}>
            <div className="rounded-2xl p-6 border border-border bg-background">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(var(--primary)/0.12)', color: 'hsl(var(--secondary))' }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1" style={{ color: 'hsl(var(--secondary))' }}>
                    <span>{admin_dashboard.howToHeading}</span>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <span>{admin_dashboard.howToBody}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </>
  );
}
