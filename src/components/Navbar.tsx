import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, Volume2 } from 'lucide-react';

interface NavbarProps {
  onStartLearning?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartLearning }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Features', id: 'features' },
    { name: 'Our Approach', id: 'approach' },
    { name: 'Voice Demo', id: 'voice-demo' },
    { name: 'FAQ', id: 'faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-midnight/85 backdrop-blur-xl border-b border-white/10 shadow-glass py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg"
          >
            {/* Holographic Crystalline Brand Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-deep via-brand-surface to-brand-midnight p-0.5 border border-brand-cyan/40 shadow-glow-cyan/20 group-hover:border-brand-cyan transition-all duration-300 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-brand-cyan/15 group-hover:bg-brand-cyan/25 transition-colors" />
              <div className="relative flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-brand-cyan" />
                <Sparkles className="w-2.5 h-2.5 text-brand-violet absolute -top-1 -right-1" />
              </div>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-brand-white font-display flex items-center gap-1">
                SAHAAYA<span className="text-gradient-cyan-blue">LEARN</span>
              </span>
              <span className="text-[9px] font-medium tracking-widest text-brand-dim uppercase -mt-1 hidden sm:block">
                Voice AI Tutor
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3.5 py-1.5 text-xs lg:text-sm font-medium text-brand-muted hover:text-brand-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="/login"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-brand-white hover:text-brand-cyan hover:bg-white/5 border border-brand-borderSubtle transition-all"
            >
              Sign In
            </a>

            <a
              href="/student/dashboard"
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-midnight font-bold text-xs sm:text-sm tracking-wide shadow-glow-cyan/50 hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Student Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-brand-surface border border-white/10 text-brand-muted hover:text-brand-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-brand-deep/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-6 transition-all duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-white hover:bg-white/5 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-white/10 mt-2">
              <button
                onClick={() => scrollTo('voice-demo')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-midnight font-bold text-sm tracking-wide text-center"
              >
                Start Learning Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
