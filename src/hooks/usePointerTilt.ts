/**
 * usePointerTilt.ts - 3D parallax tilt effect on pointer move
 * GPU-friendly using transform only
 */
import { useState, useCallback, useRef } from 'react';

interface TiltValues {
  rotateX: number;
  rotateY: number;
  scale: number;
}

interface UsePointerTiltOptions {
  maxTilt?: number;
  scale?: number;
  disabled?: boolean;
}

export function usePointerTilt(options: UsePointerTiltOptions = {}) {
  const { maxTilt = 10, scale = 1.02, disabled = false } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltValues>({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      rotateX: -percentY * maxTilt,
      rotateY: percentX * maxTilt,
      scale,
    });
  }, [maxTilt, scale, disabled]);

  const handleLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  const style = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: 'transform 0.15s ease-out',
    willChange: 'transform' as const,
  };

  return {
    ref: elementRef,
    style: disabled ? {} : style,
    handlers: disabled ? {} : {
      onMouseMove: handleMove,
      onMouseLeave: handleLeave,
    },
  };
}

export default usePointerTilt;
