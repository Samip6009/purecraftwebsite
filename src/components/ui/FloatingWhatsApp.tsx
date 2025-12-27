/**
 * FloatingWhatsApp.tsx - Fixed WhatsApp chat action
 * Visible on all pages; subtle hover scale; touch-friendly.
 */
import { useReducedMotion } from 'framer-motion';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

export function FloatingWhatsApp() {
  // We don't animate via framer-motion to keep footprint minimal
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <a
      href="https://wa.me/9779810071283"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-600 text-primary-foreground flex items-center justify-center shadow-depth-3 bottom-20 md:bottom-4"
      style={{
        willChange: 'transform',
        transition: prefersReducedMotion ? undefined : 'transform 120ms ease-out',
      }}
      onClick={() => {
        trackCTAClick('WhatsApp', 'floating_whatsapp', 'https://wa.me/9779810071283');
        trackEvent('whatsapp_click', { source: 'cta' });
      }}
      onMouseEnter={(e) => {
        if (!prefersReducedMotion) (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (!prefersReducedMotion) (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
      }}
    >
      {/* Minimal WhatsApp glyph */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.5 11.5 0 0 0 12 0C5.38 0 0 5.38 0 12c0 2.1.55 4.06 1.51 5.78L0 24l6.38-1.67A11.9 11.9 0 0 0 12 23.5c6.62 0 12-5.38 12-12 0-3.07-1.19-5.96-3.48-8.02ZM12 21.5c-1.79 0-3.5-.47-5.02-1.37l-.36-.21-3.6.94.96-3.51-.23-.37A9.5 9.5 0 1 1 12 21.5Zm5.51-7.15c-.3-.16-1.76-.86-2.04-.95-.28-.1-.48-.15-.68.15-.2.29-.78.95-.96 1.14-.18.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.36.46-.54.15-.18.2-.3.31-.5.1-.2.05-.38-.03-.54-.08-.16-.68-1.64-.94-2.25-.25-.6-.53-.51-.73-.52h-.63c-.2 0-.54.08-.83.38-.29.3-1.1 1.08-1.1 2.63 0 1.55 1.12 3.05 1.28 3.26.16.21 2.2 3.36 5.33 4.58.75.32 1.34.51 1.8.65.76.24 1.46.21 2.01.13.61-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.28-.21-.58-.36Z" />
      </svg>
    </a>
  );
}

export default FloatingWhatsApp;
