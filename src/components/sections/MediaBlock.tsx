/**
 * MediaBlock.tsx - Responsive photo/video component with lazy loading
 * Pure Craft — Visual ROI & Media upgrade
 * Supports: AVIF/WebP fallbacks, srcset, poster images, autoplay videos
 */
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { trackEvent } from '@/lib/analytics';

// Media types
export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  src: string;
  srcSet?: string;
  poster?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  // For video
  videoSrc?: {
    mp4?: string;
    webm?: string;
  };
  // SEO metadata
  seo?: {
    name: string;
    description: string;
    keywords?: string[];
  };
}

// Sample media assets with suggested alt text
export const SAMPLE_MEDIA: MediaAsset[] = [
  {
    id: 'hero-team',
    type: 'image',
    src: '/assets/photos/team-meeting.jpg',
    alt: 'Marketing team collaborating on campaign strategy',
    width: 1600,
    height: 1067,
    caption: 'Our team in action',
    seo: {
      name: 'Pure Craft Marketing Team',
      description: 'Digital marketing professionals discussing campaign strategy',
      keywords: ['marketing team', 'B2B marketing', 'campaign strategy'],
    },
  },
  {
    id: 'dashboard',
    type: 'image',
    src: '/assets/photos/dashboard-analytics.jpg',
    alt: 'Real-time analytics dashboard showing campaign performance',
    width: 1600,
    height: 1067,
    caption: 'Live campaign metrics',
    seo: {
      name: 'Campaign Analytics Dashboard',
      description: 'Real-time marketing analytics and performance metrics',
      keywords: ['analytics dashboard', 'marketing metrics', 'ROI tracking'],
    },
  },
  {
    id: 'client-success',
    type: 'video',
    src: '/assets/videos/client-success.mp4',
    poster: '/assets/photos/client-success-poster.jpg',
    alt: 'Client success story video showing business growth results',
    width: 1920,
    height: 1080,
    videoSrc: {
      mp4: '/assets/videos/client-success.mp4',
      webm: '/assets/videos/client-success.webm',
    },
    seo: {
      name: 'Client Success Story',
      description: 'Video testimonial showcasing 3x revenue growth',
      keywords: ['client testimonial', 'success story', 'business growth'],
    },
  },
];

// Suggested Unsplash search terms for photographers
export const SUGGESTED_PHOTO_KEYWORDS = [
  'B2B marketing team meeting',
  'creative ad concept shoot',
  'data dashboard close-up',
  'happy clients shaking hands',
  'modern office collaboration',
  'digital marketing strategy session',
  'social media content creation',
  'video conference business meeting',
];

// Generate ImageObject JSON-LD
export function generateImageSchema(asset: MediaAsset, pageUrl: string) {
  return {
    '@type': 'ImageObject',
    '@id': `${pageUrl}#${asset.id}`,
    url: asset.src,
    contentUrl: asset.src,
    width: asset.width || 1200,
    height: asset.height || 800,
    name: asset.seo?.name || asset.alt,
    description: asset.seo?.description || asset.alt,
    caption: asset.caption,
  };
}

// Generate VideoObject JSON-LD
export function generateVideoSchema(asset: MediaAsset, pageUrl: string) {
  return {
    '@type': 'VideoObject',
    '@id': `${pageUrl}#${asset.id}`,
    name: asset.seo?.name || asset.alt,
    description: asset.seo?.description || asset.alt,
    thumbnailUrl: asset.poster,
    contentUrl: asset.videoSrc?.mp4 || asset.src,
    uploadDate: new Date().toISOString(),
  };
}

// Props for MediaBlock component
interface MediaBlockProps {
  asset: MediaAsset;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  hoverPlay?: boolean;
  priority?: boolean;
  onPlay?: () => void;
}

export function MediaBlock({
  asset,
  className = '',
  aspectRatio = 'video',
  autoPlay = false,
  loop = true,
  muted = true,
  showControls = false,
  hoverPlay = false,
  priority = false,
  onPlay,
}: MediaBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(autoPlay && !prefersReducedMotion);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Aspect ratio classes
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]',
  };

  // Handle video play/pause on hover
  useEffect(() => {
    if (!videoRef.current || !hoverPlay) return;
    
    if (isHovered && !prefersReducedMotion) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else if (hoverPlay) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHovered, hoverPlay, prefersReducedMotion]);

  const handlePlayClick = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      trackEvent('media_played', { mediaId: asset.id, type: asset.type });
      onPlay?.();
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (asset.type === 'video') {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl bg-surface-2 ${aspectClasses[aspectRatio]} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster/Placeholder */}
        {asset.poster && !isLoaded && (
          <img
            src={asset.poster}
            alt={asset.alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width={asset.width}
            height={asset.height}
          />
        )}
        
        {/* Video */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster={asset.poster}
          muted={muted}
          loop={loop}
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          onLoadedData={handleLoad}
          controls={showControls && isPlaying}
        >
          {asset.videoSrc?.webm && (
            <source src={asset.videoSrc.webm} type="video/webm" />
          )}
          {asset.videoSrc?.mp4 && (
            <source src={asset.videoSrc.mp4} type="video/mp4" />
          )}
          <source src={asset.src} type="video/mp4" />
        </video>

        {/* Play/Pause overlay */}
        {!showControls && (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-charcoal/20 opacity-0 hover:opacity-100 transition-opacity"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            <motion.div 
              className="w-14 h-14 rounded-full bg-primary-foreground/90 flex items-center justify-center shadow-depth-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-charcoal" />
              ) : (
                <Play className="w-6 h-6 text-charcoal ml-1" />
              )}
            </motion.div>
          </button>
        )}

        {/* Caption */}
        {asset.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/60 to-transparent">
            <p className="text-caption text-primary-foreground">{asset.caption}</p>
          </div>
        )}
      </div>
    );
  }

  // Image rendering
  return (
    <div className={`relative overflow-hidden rounded-xl bg-surface-2 ${aspectClasses[aspectRatio]} ${className}`}>
      {/* LQIP placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-3 animate-pulse" />
      )}
      
      <picture>
        {/* AVIF source */}
        {asset.src.replace(/\.(jpg|png)$/, '.avif') && (
          <source
            srcSet={asset.src.replace(/\.(jpg|png)$/, '.avif')}
            type="image/avif"
          />
        )}
        {/* WebP source */}
        {asset.src.replace(/\.(jpg|png)$/, '.webp') && (
          <source
            srcSet={asset.src.replace(/\.(jpg|png)$/, '.webp')}
            type="image/webp"
          />
        )}
        <img
          src={asset.src}
          srcSet={asset.srcSet}
          alt={asset.alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          decoding="async"
          width={asset.width}
          height={asset.height}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>

      {/* Caption */}
      {asset.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/60 to-transparent">
          <p className="text-caption text-primary-foreground">{asset.caption}</p>
        </div>
      )}
    </div>
  );
}

// Thumbnail variant for tiles
export function MediaThumbnail({
  asset,
  className = '',
  hoverEffect = true,
}: {
  asset: MediaAsset;
  className?: string;
  hoverEffect?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video preview on hover
  useEffect(() => {
    if (!videoRef.current || asset.type !== 'video') return;
    
    if (isHovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, asset.type]);

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {asset.type === 'video' ? (
        <>
          <img
            src={asset.poster || asset.src}
            alt={asset.alt}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              hoverEffect && isHovered ? 'scale-105' : 'scale-100'
            }`}
            loading="lazy"
            decoding="async"
            width={asset.width}
            height={asset.height}
          />
          <video
            ref={videoRef}
            src={asset.src}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Play icon indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary-foreground/80 flex items-center justify-center">
            <Play className="w-3 h-3 text-charcoal ml-0.5" />
          </div>
        </>
      ) : (
        <img
          src={asset.src}
          alt={asset.alt}
          loading="lazy"
          decoding="async"
          width={asset.width}
          height={asset.height}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            hoverEffect && isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
      )}
    </div>
  );
}

export default MediaBlock;
