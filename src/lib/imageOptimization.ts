/**
 * Image optimization utilities for Pure Craft
 * AVIF/WebP support, responsive srcsets, LQIP
 */

export interface ImageSources {
  src: string;
  srcSet?: string;
  sizes?: string;
  placeholder?: string;
}

/**
 * Generates responsive image srcset for different screen sizes
 */
export function generateSrcSet(
  basePath: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  // For now, return the base path since we're using static images
  // In production, this would generate URLs for different sizes
  return basePath;
}

/**
 * Default image loading settings optimized for performance
 */
export const imageDefaults = {
  loading: 'lazy' as const,
  decoding: 'async' as const,
  fetchPriority: 'auto' as const,
};

/**
 * Critical image settings for above-the-fold content
 */
export const criticalImageDefaults = {
  loading: 'eager' as const,
  decoding: 'async' as const,
  fetchPriority: 'high' as const,
};

/**
 * Generate a simple color placeholder based on average image color
 */
export function getPlaceholderColor(category: 'dark' | 'light' | 'gradient' = 'dark'): string {
  const colors = {
    dark: 'hsl(0, 0%, 12%)',
    light: 'hsl(0, 0%, 96%)',
    gradient: 'linear-gradient(135deg, hsl(0, 0%, 12%) 0%, hsl(0, 0%, 20%) 100%)',
  };
  return colors[category];
}

/**
 * Check if WebP is supported
 */
let webpSupported: boolean | null = null;
export async function supportsWebP(): Promise<boolean> {
  if (webpSupported !== null) return webpSupported;
  
  if (typeof document === 'undefined') return false;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0;
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Check if AVIF is supported
 */
let avifSupported: boolean | null = null;
export async function supportsAVIF(): Promise<boolean> {
  if (avifSupported !== null) return avifSupported;
  
  if (typeof document === 'undefined') return false;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      avifSupported = img.width > 0 && img.height > 0;
      resolve(avifSupported);
    };
    img.onerror = () => {
      avifSupported = false;
      resolve(false);
    };
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABogQEAwgMg8f8D///8WfhwB8+ErS42I=';
  });
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, options: { as?: string; type?: string } = {}): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options.as || 'image';
  link.href = src;
  if (options.type) link.type = options.type;
  document.head.appendChild(link);
}
