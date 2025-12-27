/**
 * Pure Craft Design Tokens
 * Centralized design system values for consistent theming
 */

export const colors = {
  // Core Palette
  background: '#FFFFFF',
  foreground: '#0B0B0B',
  
  // Layered Surfaces
  surface: {
    1: '#FFFFFF',
    2: '#FAFAFA',
    3: '#F5F5F5',
  },
  
  // Text Hierarchy
  text: {
    primary: '#0B0B0B',
    secondary: '#474747',
    tertiary: '#7A7A7A',
    muted: '#A3A3A3',
  },
  
  // Charcoal Accents
  charcoal: {
    DEFAULT: '#1F1F1F',
    light: '#333333',
    muted: '#525252',
  },
  
  // Glass Effects
  glass: {
    background: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.2)',
    blur: '20px',
  },
} as const;

export const shadows = {
  1: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  2: '0 4px 12px -2px rgba(0, 0, 0, 0.06)',
  3: '0 12px 32px -4px rgba(0, 0, 0, 0.08)',
  4: '0 24px 48px -8px rgba(0, 0, 0, 0.12)',
  glow: '0 0 40px rgba(0, 0, 0, 0.04)',
} as const;

export const motion = {
  duration: {
    short: 160,
    medium: 320,
    long: 640,
  },
  easing: {
    outCubic: [0.33, 1, 0.68, 1] as const,
    inOutQuad: [0.45, 0, 0.55, 1] as const,
  },
} as const;

export const typography = {
  fontFamily: {
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  scale: {
    display: { size: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1.1 },
    h1: { size: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 },
    h2: { size: 'clamp(1.875rem, 4vw, 2.5rem)', lineHeight: 1.15 },
    h3: { size: 'clamp(1.5rem, 3vw, 1.75rem)', lineHeight: 1.2 },
    bodyLg: { size: '1.125rem', lineHeight: 1.7 },
    body: { size: '1rem', lineHeight: 1.7 },
    small: { size: '0.875rem', lineHeight: 1.5 },
    caption: { size: '0.75rem', lineHeight: 1.4 },
  },
} as const;

export const layout = {
  container: {
    narrow: '48rem',
    content: '65rem',
    wide: '80rem',
    fullBleed: '112.5rem',
  },
  spacing: {
    section: {
      sm: '4rem',
      md: '6rem',
      lg: '8rem',
    },
    block: {
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
    },
  },
} as const;

export const grid = {
  bento: {
    '2x2': 'repeat(2, 1fr)',
    '3x3': 'repeat(3, 1fr)',
    asymmetric: {
      columns: '2fr 1fr',
      rows: 'auto',
    },
  },
  gap: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
} as const;

// Framer Motion variants
export const motionVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: motion.easing.outCubic },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: motion.easing.outCubic },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: motion.easing.outCubic },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: motion.easing.outCubic },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const;
