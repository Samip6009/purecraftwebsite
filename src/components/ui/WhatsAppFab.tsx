import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/9779810071283?text=Hi%20Pure%20Craft%2C%20I%27d%20like%20to%20book%20a%20demo';

export function WhatsAppFab() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-primary-foreground shadow-depth-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
      aria-label="Chat with Pure Craft on WhatsApp"
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
    >
      <MessageCircle className="w-6 h-6" aria-hidden="true" />
      <span className="sr-only">WhatsApp</span>
    </motion.a>
  );
}

export default WhatsAppFab;
