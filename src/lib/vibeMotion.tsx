/**
 * vibeMotion.tsx - Shared Framer Motion variants and tokens
 * SSR-friendly, respects prefers-reduced-motion
 * Visual-first: headlineSplit, kpiEntrance, chartDraw for cinematic animations
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
    cinematic: 1.2,
  },
  ease: {
    out: [0.33, 1, 0.68, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
    luxury: [0.16, 1, 0.3, 1] as const,
    bounce: [0.68, -0.6, 0.32, 1.6] as const,
    smooth: [0.4, 0, 0.2, 1] as const,
  },
  stagger: {
    fast: 0.04,
    base: 0.08,
    slow: 0.12,
    headline: 0.06,
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

// Headline split reveal - staggered line-by-line with mask
export const headlineSplit: Variants = {
  hidden: { 
    opacity: 0,
    y: 40,
    skewY: 2,
  },
  visible: (i: number = 0) => ({ 
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.ease.luxury,
      delay: i * motionTokens.stagger.headline,
    },
  }),
};

// KPI entrance - 3D-ish parallax tilt entrance
export const kpiEntrance: Variants = {
  hidden: { 
    opacity: 0,
    y: 30,
    rotateX: -15,
    scale: 0.95,
  },
  visible: (i: number = 0) => ({ 
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.ease.out,
      delay: 0.3 + (i * 0.12),
    },
  }),
};

// Chart draw - for animated chart lines and bars
export const chartDraw: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: motionTokens.duration.luxury,
        ease: motionTokens.ease.inOut,
      },
      opacity: {
        duration: motionTokens.duration.fast,
      },
    },
  },
};

// Bar grow - for animated bar charts
export const barGrow: Variants = {
  hidden: { 
    scaleY: 0,
    opacity: 0,
    originY: 1,
  },
  visible: (i: number = 0) => ({ 
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.ease.out,
      delay: i * 0.1,
    },
  }),
};

// Counter tick - for animated number counters
export const counterTick: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
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

// Fast stagger for KPIs
export const kpiStaggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
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

// Donut ring animation
export const donutRing: Variants = {
  hidden: { 
    strokeDashoffset: 100,
    opacity: 0,
  },
  visible: { 
    strokeDashoffset: 0,
    opacity: 1,
    transition: {
      strokeDashoffset: {
        duration: motionTokens.duration.luxury,
        ease: motionTokens.ease.inOut,
      },
      opacity: {
        duration: motionTokens.duration.fast,
      },
    },
  },
};

// Confetti burst
export const confettiBurst: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
  },
  visible: { 
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
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

// Hook for using motion with reduced motion check
export const useVibe = (prefersReducedMotion: boolean, isMobile: boolean = false) => {
  const getVariant = <T extends Variants>(variant: T): T | Variants => {
    if (prefersReducedMotion) return reducedMotion;
    return variant;
  };

  const getDuration = (duration: number): number => {
    if (prefersReducedMotion) return 0.1;
    if (isMobile) return duration * 0.6; // 40% faster on mobile
    return duration;
  };

  return {
    getVariant,
    getDuration,
    reduced: prefersReducedMotion,
    mobile: isMobile,
  };
};

// Export all variants as a collection
export const vibeVariants = {
  tileReveal,
  hoverLift,
  headlineSplit,
  kpiEntrance,
  chartDraw,
  barGrow,
  counterTick,
  donutRing,
  confettiBurst,
  slideOverOpen,
  backdropFade,
  staggerContainer,
  kpiStaggerContainer,
  fadeUp,
  scaleIn,
  reducedMotion,
};

export default vibeVariants;
