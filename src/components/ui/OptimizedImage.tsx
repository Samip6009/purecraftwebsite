/**
 * OptimizedImage.tsx - Performance-optimized image component
 * Lazy loading, LQIP, responsive srcsets
 */
import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { getPlaceholderColor, imageDefaults, criticalImageDefaults } from '@/lib/imageOptimization';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'color' | 'none';
  placeholderColor?: 'dark' | 'light' | 'gradient';
  className?: string;
  containerClassName?: string;
  onLoadComplete?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'color',
  placeholderColor = 'dark',
  className = '',
  containerClassName = '',
  onLoadComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const loadingProps = priority ? criticalImageDefaults : imageDefaults;
  const bgColor = placeholder !== 'none' ? getPlaceholderColor(placeholderColor) : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{
        backgroundColor: bgColor,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          {...loadingProps}
          {...props}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
