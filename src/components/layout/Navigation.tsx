import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from './SiteShell';

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" role="navigation" aria-label="Main navigation">
      {/* Glass Background */}
      <div className="absolute inset-0 glass" />
      
      <Container size="wide" className="relative">
        <div className="flex items-center justify-between h-18 md:h-22">
          {/* Logo */}
          <motion.a
            href="/"
            className="relative z-10 font-serif text-xl md:text-2xl font-medium text-text-primary"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            Pure Craft
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="link-editorial text-small font-medium text-text-secondary hover:text-text-primary transition-colors duration-medium"
              >
                {link.name}
              </a>
            ))}
            
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-small font-medium rounded-full transition-all duration-medium hover:shadow-depth-3"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              Book a Call
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative z-10 md:hidden p-2 -mr-2 text-text-primary"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden"
          >
            <Container className="py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-medium rounded-full mt-2"
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
                >
                  Book a Call
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
