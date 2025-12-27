/**
 * vibeMotion.tsx - Shared Framer Motion variants and tokens
 * SSR-friendly, respects prefers-reduced-motion
 */
import { Variants } from 'framer-motion';

// Motion tokens for consistent timing across the site
export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    base: 0.4,
    slow: 0.6,
    luxury: 0.8,
  },
  ease: {
    out: [0.33, 1, 0.68, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
    luxury: [0.16, 1, 0.3, 1] as const,
    bounce: [0.68, -0.6, 0.32, 1.6] as const,
  },
  stagger: {
    fast: 0.04,
    base: 0.08,
    slow: 0.12,
  },
};

// Tile reveal - for bento cards and portfolio items
export const tileReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.out,
    },
  },
};

// Hover lift - subtle elevation on hover
export const hoverLift: Variants = {
  rest: { 
    y: 0,
    scale: 1,
  },
  hover: { 
    y: -6,
    scale: 1.01,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.out,
    },
  },
};

// Slide over panel (for case study panels)
export const slideOverOpen: Variants = {
  hidden: { 
    x: '100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.ease.luxury,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.inOut,
    },
  },
};

// Backdrop fade
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: motionTokens.duration.fast },
  },
  exit: { 
    opacity: 0,
    transition: { duration: motionTokens.duration.fast },
  },
};

// Staggered container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.stagger.base,
      delayChildren: 0.1,
    },
  },
};

// Fade up - generic content reveal
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.out,
    },
  },
};

// Scale in - for modals, popovers
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: motionTokens.duration.instant,
    },
  },
};

// Simplified variants for reduced motion / mobile
export const reducedMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// Export all variants as a collection
export const vibeVariants = {
  tileReveal,
  hoverLift,
  slideOverOpen,
  backdropFade,
  staggerContainer,
  fadeUp,
  scaleIn,
  reducedMotion,
};

export default vibeVariants;
