/**
 * Header.tsx - Main site header with logo, navigation, and socials
 * Features: Glass effect, mobile menu, Instagram/Facebook links
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Instagram } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from './SiteShell';
import { trackCTAClick, trackSocialClick } from '@/lib/analytics';

// Facebook icon (not in lucide-react)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'ROI Calculator', href: '#roi' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/purecraft.media?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', 
    icon: Instagram,
  },
  { 
    name: 'Facebook', 
    href: 'https://www.facebook.com/profile.php?id=61576632570565', 
    icon: FacebookIcon,
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleCTAClick = () => {
    trackCTAClick('Get Started', 'header', '#contact');
  };

  const handleSocialClick = (platform: string) => {
    trackSocialClick(platform);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      {/* Glass Background */}
      <div className="absolute inset-0 glass" />
      
      <Container size="wide" className="relative">
        <div className="flex items-center justify-between h-16 md:h-20 py-2">
          {/* Logo - Fixed sizing and vertical centering */}
          <motion.a
            href="/"
            className="relative z-10 flex items-center gap-2 md:gap-3 flex-shrink-0"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            aria-label="Pure Craft - Home"
          >
            <img
              src="/assets/pure-craft-logo.svg"
              alt="Pure Craft"
              width={40}
              height={40}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <span className="font-serif text-sm sm:text-base md:text-lg font-medium text-text-primary whitespace-nowrap hidden sm:inline">
              Pure Craft
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="link-editorial text-small font-medium text-text-secondary hover:text-text-primary transition-colors duration-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.name)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-charcoal-muted hover:bg-surface-2 transition-all duration-medium"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-4 h-4 text-text-secondary" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              onClick={handleCTAClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-small font-medium rounded-full transition-all duration-medium hover:shadow-depth-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Mobile CTA + Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.a
              href="#contact"
              onClick={handleCTAClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-small font-medium rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            <button
              onClick={toggleMenu}
              className="relative z-10 p-2 -mr-2 text-primary-foreground bg-charcoal rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border lg:hidden"
          >
            <Container className="py-6">
              <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-text-secondary hover:text-text-primary transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 rounded-md"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
                  >
                    {link.name}
                  </motion.a>
                ))}

                {/* Mobile Social Links */}
                <div className="flex items-center gap-4 py-4 border-t border-border mt-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSocialClick(social.name)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <social.icon className="w-5 h-5 text-text-secondary" />
                    </a>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.a
                  href="#contact"
                  onClick={() => {
                    setIsOpen(false);
                    handleCTAClick();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-medium rounded-full mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
