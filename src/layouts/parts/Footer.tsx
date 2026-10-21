import { Link } from 'react-router';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const footerLinks = {
  Society: [
    { label: 'Home', href: '/' },
    { label: 'About StatSoc', href: '/#about' },
    { label: 'Join Us', href: '/membership' },
  ],
  Explore: [
    { label: 'Events', href: '/events' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Fun Stats', href: '/fun' },
  ],
  Connect: [
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'USU Page', href: 'https://www.usu.edu.au', target: '_blank' },
    { label: 'Contact Us', href: 'mailto:statsoc@sydney.edu.au' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Yellow wave divider */}
      <div className="w-full overflow-hidden leading-none" style={{ height: '48px' }}>
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 48 C360 0 1080 0 1440 48 L1440 0 L0 0 Z" fill="white"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>StatSoc</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
              Statistics Society of the University of Sydney. Where data meets community.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ color: 'hsl(var(--primary))' }}
                aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ color: 'hsl(var(--primary))' }}
                aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ color: 'hsl(var(--primary))' }}
                aria-label="Facebook">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'hsl(var(--primary))' }}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {'target' in link ? (
                      <a
                        href={link.href}
                        target={link.target}
                        rel="noopener noreferrer"
                        className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © 2026 StatSoc — University of Sydney. All rights reserved.
          </p>
          <p className="text-secondary-foreground/40 text-xs">
            Made with 💛 by StatSoc
          </p>
        </div>
      </div>
    </footer>
  );
}
