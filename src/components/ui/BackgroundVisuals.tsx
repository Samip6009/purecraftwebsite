/**
 * BackgroundVisuals.tsx - Premium visual layers to eliminate white space
 * Animated gradient mesh, brand patterns, floating UI elements
 * All with reduced-motion support
 */
import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated Gradient Mesh - Soft, slow-moving gradient background
 * Use on hero, contact, and large sections
 */
export function GradientMesh({ className = '' }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2/60 via-background to-surface-3/40" />
      
      {/* Animated orbs - only if motion allowed */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-charcoal/[0.03] to-transparent blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-charcoal-light/[0.04] to-transparent blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ bottom: '20%', right: '10%' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-charcoal-muted/[0.02] to-transparent blur-3xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ top: '50%', left: '40%' }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Brand Pattern Grid - Subtle dot/grid pattern with parallax
 * Use for services, proof sections
 */
export function BrandPatternGrid({ 
  className = '',
  variant = 'dots'
}: { 
  className?: string;
  variant?: 'dots' | 'grid' | 'diagonal';
}) {
  const prefersReducedMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY * 0.05);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const patterns = {
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000' fill-opacity='0.04'/%3E%3C/svg%3E")`,
    grid: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23000' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20' stroke='%23000' stroke-opacity='0.025' stroke-width='1'/%3E%3C/svg%3E")`,
  };

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: patterns[variant],
        transform: prefersReducedMotion ? 'none' : `translateY(${scrollY}px)`,
      }}
    />
  );
}

/**
 * Background Visual - Photo/video with blur, darken, grain overlay
 * For sections that need human/agency feel
 */
export function BackgroundVisual({ 
  src,
  alt = 'Background',
  type = 'image',
  className = '',
  opacity = 0.08,
  blur = true,
}: { 
  src: string;
  alt?: string;
  type?: 'image' | 'video';
  className?: string;
  opacity?: number;
  blur?: boolean;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {type === 'image' ? (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${blur ? 'blur-sm' : ''}`}
          style={{ opacity }}
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
        />
      ) : (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${blur ? 'blur-sm' : ''}`}
          style={{ opacity }}
        />
      )}
      
      {/* Darken overlay */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Film grain texture */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/**
 * Floating KPI Cards - Subtle floating metric cards
 * For hero and results sections
 */
export function FloatingKPICards({ className = '' }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  const cards = [
    { label: 'ROAS', value: '8.2x', color: 'bg-green-50 border-green-100' },
    { label: 'Leads', value: '+47%', color: 'bg-blue-50 border-blue-100' },
    { label: 'Revenue', value: '$2.4M', color: 'bg-purple-50 border-purple-100' },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className={`absolute px-4 py-3 rounded-xl border shadow-depth-2 ${card.color}`}
          initial={{ opacity: 0.3 }}
          animate={prefersReducedMotion ? {} : {
            y: [0, -15, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
          style={{
            top: `${20 + i * 25}%`,
            right: `${5 + i * 10}%`,
          }}
        >
          <span className="text-caption text-text-muted block">{card.label}</span>
          <span className="text-lg font-serif text-text-primary">{card.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Funnel Flow Lines - Animated connector lines
 * For diagnostic and services sections
 */
export function FunnelFlowLines({ className = '' }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 10 20 Q 50 30 90 25"
          fill="none"
          stroke="hsl(var(--charcoal-muted))"
          strokeWidth="0.15"
          strokeDasharray="2 2"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={prefersReducedMotion ? { pathLength: 1, opacity: 0.1 } : { 
            pathLength: [0, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M 5 50 Q 40 55 95 45"
          fill="none"
          stroke="hsl(var(--charcoal-muted))"
          strokeWidth="0.1"
          strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={prefersReducedMotion ? { pathLength: 1, opacity: 0.1 } : { 
            pathLength: [0, 1],
            opacity: [0.03, 0.12, 0.03],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.path
          d="M 15 80 Q 60 70 85 75"
          fill="none"
          stroke="hsl(var(--charcoal-muted))"
          strokeWidth="0.12"
          strokeDasharray="1.5 1.5"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={prefersReducedMotion ? { pathLength: 1, opacity: 0.1 } : { 
            pathLength: [0, 1],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </svg>
    </div>
  );
}

export default {
  GradientMesh,
  BrandPatternGrid,
  BackgroundVisual,
  FloatingKPICards,
  FunnelFlowLines,
};
