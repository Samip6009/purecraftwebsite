import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects accessibility preferences for animations
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation props that respect reduced motion preference
 * Use this wrapper for Framer Motion components
 */
export function useMotionSafe<T extends object>(
  animationProps: T,
  reducedProps: Partial<T> = {}
): T | Partial<T> {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return {
      ...animationProps,
      ...reducedProps,
      transition: { duration: 0 },
    };
  }
  
  return animationProps;
}
