/**
 * Framer Motion configuration for optimal performance
 * Restricts to transform and opacity, reduces duration on mobile
 */

/**
 * Check if device is mobile (< 768px)
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Check if device is small mobile (< 420px)
 */
export const isSmallMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 420;
};

/**
 * Duration multiplier based on device size
 * Mobile gets 40% reduction
 */
export const getDurationMultiplier = (): number => {
  if (isSmallMobile()) return 0; // No animation on very small screens
  if (isMobile()) return 0.6; // 40% reduction on mobile
  return 1;
};

/**
 * Performance-safe animation variants
 * Only uses transform and opacity for GPU acceleration
 */
export const safeVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
};

/**
 * Standard easing curves
 */
export const easings = {
  smooth: [0.16, 1, 0.3, 1] as const,
  snappy: [0.32, 0.72, 0, 1] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
};

/**
 * Standard durations (before mobile reduction)
 */
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 0.8,
};

/**
 * Get safe transition config
 */
export const getTransition = (
  duration: keyof typeof durations = 'normal',
  options: {
    delay?: number;
    ease?: typeof easings[keyof typeof easings];
    reducedMotion?: boolean;
  } = {}
) => {
  const { delay = 0, ease = easings.smooth, reducedMotion = false } = options;
  
  if (reducedMotion) {
    return { duration: 0 };
  }
  
  const multiplier = getDurationMultiplier();
  
  return {
    duration: durations[duration] * multiplier,
    delay: delay * multiplier,
    ease,
  };
};

/**
 * Viewport settings optimized for performance
 */
export const viewportConfig = {
  once: true,
  margin: '-50px',
  amount: 0.1,
};

/**
 * Hover animation props that only activate on non-touch devices
 */
export const hoverProps = (reducedMotion: boolean = false) => {
  if (reducedMotion || isMobile()) {
    return {};
  }
  return {
    whileHover: { scale: 1.02, y: -4 },
    transition: { duration: 0.2 },
  };
};

/**
 * Tap animation props
 */
export const tapProps = (reducedMotion: boolean = false) => {
  if (reducedMotion) {
    return {};
  }
  return {
    whileTap: { scale: 0.98 },
  };
};
