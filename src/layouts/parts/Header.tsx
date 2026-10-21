import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import globalContent from '../../../content/global.json';
import { useCmsContent } from '@/lib/use-cms-content';

export default function Header() {
  const content = useCmsContent('global', globalContent);
  const { header } = content;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={header.logo}
            alt={header.logoAlt}
            className="block h-auto max-h-10 md:max-h-12 w-auto max-w-full object-contain self-center"
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 lg:gap-8">
          {header.navigation.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-sm font-semibold transition-colors duration-200 group ${
                location.pathname === link.href
                  ? 'text-foreground'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
          <Link
            to={header.joinHref}
            className="ml-2 px-5 py-2 rounded-full bg-primary text-secondary font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
            style={{ boxShadow: '0 2px 8px hsl(var(--primary)/0.3)' }}
          >
            {header.joinLabel}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-4 gap-4">
              {header.navigation.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={header.joinHref}
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-full bg-primary text-secondary font-bold text-sm text-center transition-all duration-200 hover:scale-105"
              >
                {header.joinLabel}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
