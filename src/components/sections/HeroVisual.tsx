/**
 * HeroVisual.tsx - 80/20 visual-first hero with media canvas
 * Pure Craft — Visual ROI & Media upgrade
 * Features: Large media area (80%), concise copy (20%), video support
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Users, BarChart3, Play, Pause } from 'lucide-react';
import { Container } from '@/components/layout/SiteShell';
import { vibeVariants, motionTokens, useVibe } from '@/lib/vibeMotion';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

// KPI data with mini visuals
const kpiData = [
  { metric: '+312%', label: 'Lead Growth', icon: TrendingUp, sparkline: [20, 35, 28, 48, 62, 78, 95, 100] },
  { metric: '47%', label: 'Close Rate', icon: Users, sparkline: [30, 32, 38, 42, 45, 47, 47, 47] },
  { metric: '8.2x', label: 'ROAS', icon: BarChart3, sparkline: [15, 25, 32, 48, 55, 68, 72, 82] },
];

// Concise hero copy (max 8 words headline, 10 words subhead)
export const heroVariants = [
  { headline: 'Leads that close.', subhead: 'AI marketing for real growth.', audience: 'founder' },
  { headline: 'More demos. Less chaos.', subhead: 'Pipeline on autopilot.', audience: 'growth' },
  { headline: 'Your growth engine.', subhead: 'Book more, close more.', audience: 'sme' },
];

// Sparkline component
const Sparkline = ({ data, className }: { data: number[]; className?: string }) => {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
      />
    </svg>
  );
};

// KPI Card with tilt
const KPICard = ({ kpi, index, reduced }: { kpi: typeof kpiData[0]; index: number; reduced: boolean }) => {
  const tilt = usePointerTilt({ maxTilt: 6, disabled: reduced });
  const Icon = kpi.icon;

  return (
    <motion.div
      ref={tilt.ref}
      variants={vibeVariants.kpiEntrance}
      custom={index}
      className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 shadow-depth-2"
      style={tilt.style}
      {...tilt.handlers}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-text-secondary" />
        </div>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">{kpi.label}</span>
      </div>
      <div className="font-serif text-2xl text-text-primary mb-2">{kpi.metric}</div>
      <Sparkline data={kpi.sparkline} className="h-8 w-full text-charcoal-muted" />
    </motion.div>
  );
};

// Video/Image hero media component
const HeroMedia = ({ reduced }: { reduced: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        trackEvent('media_played', { mediaId: 'hero-video', location: 'hero' });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden bg-surface-2 shadow-depth-3">
      {/* Placeholder for hero video/image */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface-3 to-surface-2">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(hsl(var(--charcoal)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--charcoal)) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-charcoal/5 blur-3xl"
          animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-charcoal/5 blur-3xl"
          animate={reduced ? {} : { scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Video element (hidden until real video is provided) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        poster="/assets/photos/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/assets/videos/hero-preview.webm" type="video/webm" />
        <source src="/assets/videos/hero-preview.mp4" type="video/mp4" />
      </video>

      {/* Play button overlay */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center group"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-primary-foreground/90 flex items-center justify-center shadow-depth-3 opacity-80 group-hover:opacity-100 transition-opacity"
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

      {/* Caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/60 to-transparent">
        <p className="text-caption text-primary-foreground/80">See how we drive results →</p>
      </div>
    </div>
  );
};

interface HeroVisualProps {
  variant?: number;
}

export function HeroVisual({ variant = 0 }: HeroVisualProps) {
  const prefersReducedMotion = useFramerReducedMotion() ?? false;
  const [currentKPI, setCurrentKPI] = useState(0);
  const { getVariant } = useVibe(prefersReducedMotion);
  const copy = heroVariants[variant] || heroVariants[0];

  // Auto-rotate KPIs on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKPI((prev) => (prev + 1) % kpiData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrimaryCTA = () => {
    trackCTAClick('Book Demo', 'hero_visual', '#contact');
  };

  const handleSecondaryCTA = () => {
    trackCTAClick('See ROI', 'hero_visual', '#roi');
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-2/20 via-background to-background" />

      <Container size="wide" className="relative z-10">
        {/* 80/20 Layout: Large visual area + compact text */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Left: Text (20% - 1 column on desktop) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Headline - max 8 words */}
            <motion.h1
              variants={getVariant(vibeVariants.headlineSplit)}
              initial="hidden"
              animate="visible"
              className="font-serif text-display text-text-primary mb-4"
            >
              {copy.headline}
            </motion.h1>

            {/* Subhead - max 10 words */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : motionTokens.duration.base, delay: 0.2 }}
              className="text-body-lg text-text-secondary mb-6"
            >
              {copy.subhead}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : motionTokens.duration.base, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.a
                href="#contact"
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                Book Demo
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#roi"
                onClick={handleSecondaryCTA}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-text-primary font-medium rounded-full border border-border hover:bg-surface-2 transition-colors"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                See ROI
              </motion.a>
            </motion.div>

            {/* Trust microcopy - very short */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-caption text-text-muted"
            >
              Free call • No commitment • 30-day results
            </motion.p>
          </div>

          {/* Right: Visual Canvas (80% - 3 columns on desktop) */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            >
              {/* Main hero media */}
              <HeroMedia reduced={prefersReducedMotion} />

              {/* KPI cards overlay */}
              <motion.div
                variants={vibeVariants.kpiStaggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-4 grid grid-cols-3 gap-3"
              >
                {/* Desktop: all 3 */}
                <div className="hidden md:contents">
                  {kpiData.map((kpi, index) => (
                    <KPICard key={kpi.label} kpi={kpi} index={index} reduced={prefersReducedMotion} />
                  ))}
                </div>

                {/* Mobile: single rotating */}
                <div className="col-span-3 md:hidden">
                  <motion.div
                    key={currentKPI}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <KPICard kpi={kpiData[currentKPI]} index={0} reduced={prefersReducedMotion} />
                  </motion.div>
                  <div className="flex justify-center gap-2 mt-3">
                    {kpiData.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentKPI(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentKPI ? 'bg-charcoal' : 'bg-border'}`}
                        aria-label={`View KPI ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroVisual;
