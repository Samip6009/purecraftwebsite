/**
 * useAnimatedCounter.ts - Animated number counter hook
 * Smooth count-up with easing, respects reduced motion
 */
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  easing?: (t: number) => number;
  decimals?: number;
  start?: number;
  enabled?: boolean;
}

// Easing functions
const easings = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};

export function useAnimatedCounter(
  end: number,
  options: UseAnimatedCounterOptions = {}
) {
  const {
    duration = 1000,
    easing = easings.easeOutCubic,
    decimals = 0,
    start = 0,
    enabled = true,
  } = options;

  const [value, setValue] = useState(enabled ? start : end);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(start);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const current = startValueRef.current + (end - startValueRef.current) * easedProgress;
    setValue(current);

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [end, duration, easing]);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    // Reset animation when end value changes
    startValueRef.current = value;
    startTimeRef.current = undefined;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, enabled, animate]);

  const formattedValue = decimals > 0 
    ? value.toFixed(decimals) 
    : Math.round(value);

  return {
    value,
    formattedValue,
    displayValue: typeof formattedValue === 'number' 
      ? formattedValue.toLocaleString() 
      : Number(formattedValue).toLocaleString(),
  };
}

export { easings };
export default useAnimatedCounter;
