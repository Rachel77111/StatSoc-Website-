import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, BarChart2, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';
import { admin_login } from 'virtual:content';

// Google "G" SVG logo
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/admin',
    });
    setLoading(false);
    if (err) setError(err.message ?? 'Invalid email or password.');
  }

  async function handleGoogleLogin() {
    setError('');
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/admin',
    });
  }

  return (
    <>
      <Helmet>
        <title>Admin Login — StatSoc</title>
        <meta name="description" content="StatSoc executive admin login. Restricted access only." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{ background: 'hsl(var(--secondary))' }}>

        {/* Ambient dots */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: 4 + (i % 4) * 5, height: 4 + (i % 4) * 5,
                left: `${(i * 19 + 7) % 94}%`, top: `${(i * 27 + 8) % 88}%`,
                background: 'hsl(var(--primary)/0.1)',
              }}
              animate={{ y: [0, -10, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4 + (i % 3), delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' as const }}
          className="relative w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'hsl(var(--background))' }}>

            {/* Logo mark */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'hsl(var(--primary))' }}>
                <BarChart2 size={28} style={{ color: 'hsl(var(--secondary))' }} />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: 'hsl(var(--secondary))' }}>
              <span>{admin_login.title}</span>
            </h1>
            <p className="text-center text-muted-foreground text-sm mb-8">
              <span>{admin_login.subtitle}</span>
            </p>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: 'hsl(var(--accent)/0.1)', color: 'hsl(var(--accent))' }}>
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Google */}
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 hover:shadow-md mb-5"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--secondary))' }}
            >
              <GoogleIcon />
              <span>{admin_login.googleButton}</span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
              <span className="text-xs text-muted-foreground">{admin_login.divider}</span>
              <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
            </div>

            {/* Email / password form */}
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={admin_login.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  aria-label="Email address"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={admin_login.passwordPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  aria-label="Password"
                />
              </div>
              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md disabled:opacity-60"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--secondary))' }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><LogIn size={15} /> <span>{admin_login.signInButton}</span></>
                )}
              </motion.button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              <span>{admin_login.footer}</span>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
