/**
 * MobileStickyCTA.tsx - Sticky CTA bar for mobile
 * Shows on scroll with call/WhatsApp/Book actions
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookDemo = () => {
    trackCTAClick('Book Now', 'mobile_sticky_cta', '#contact');
    trackEvent('book_demo_click', { source: 'primary_cta' });
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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-xl border-t border-border shadow-depth-4 md:hidden"
        >
          <div className="flex gap-3">
            {/* Call */}
            <a
              href="tel:+9779810071283"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-charcoal text-primary-foreground font-medium rounded-xl"
              aria-label="Call us"
              onClick={() => {
                trackCTAClick('Call', 'mobile_sticky_cta', 'tel:+9779810071283');
                trackEvent('call_click', { source: 'cta' });
              }}
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/9779810071283"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-green-600 text-primary-foreground font-medium rounded-xl"
              aria-label="WhatsApp us"
              onClick={() => {
                trackCTAClick('WhatsApp', 'mobile_sticky_cta', 'https://wa.me/9779810071283');
                trackEvent('whatsapp_click', { source: 'cta' });
              }}
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
