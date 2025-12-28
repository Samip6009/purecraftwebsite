/**
 * MobileStickyCTA.tsx - Sticky CTA bar for mobile
 * Shows on scroll with call/WhatsApp/Book actions
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px (lowered from 400px for faster CTA visibility)
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookDemo = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-md md:hidden"
        >
          <div className="flex gap-3">
            {/* Call */}
            <a
              href="tel:+9779810071283"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-charcoal text-primary-foreground font-medium rounded-xl"
              aria-label="Call us"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/9779810071283?text=Hi%20Pure%20Craft%2C%20I%27d%20like%20to%20book%20a%20demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-green-600 text-primary-foreground font-medium rounded-xl"
              aria-label="WhatsApp us"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            
            {/* Book */}
            <button
              onClick={handleBookDemo}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 border border-border text-text-primary font-medium rounded-xl hover:bg-surface-2"
              aria-label="Book a demo"
            >
              <Calendar className="w-4 h-4" />
              Book
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileStickyCTA;
