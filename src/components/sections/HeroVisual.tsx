/**
 * HeroVisual.tsx - Visual-first hero with animated KPI cards
 * Features: Headline split reveal, KPI carousel, sparkline preview
 * SSR-friendly, respects reduced motion
 */
import { useState, useEffect } from 'react';
import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { Container } from '@/components/layout/SiteShell';
import { vibeVariants, motionTokens, useVibe } from '@/lib/vibeMotion';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { trackCTAClick } from '@/lib/analytics';

// KPI data with mini visual context
const kpiData = [
  { 
    metric: '+312%', 
    label: 'Lead Growth', 
    icon: TrendingUp,
    sparkline: [20, 35, 28, 48, 62, 78, 95, 100],
  },
  { 
    metric: '47%', 
    label: 'Close Rate', 
    icon: Users,
    sparkline: [30, 32, 38, 42, 45, 47, 47, 47],
  },
  { 
    metric: '8.2x', 
    label: 'ROAS', 
    icon: BarChart3,
    sparkline: [15, 25, 32, 48, 55, 68, 72, 82],
  },
];

// Hero copy variants - ultra concise
export const heroVariants = [
  {
    headline: ['Leads that close.', 'Revenue that scales.'],
    subhead: 'AI-powered marketing for enterprise growth.',
    audience: 'founder',
  },
  {
    headline: ['More demos.', 'Less chaos.'],
    subhead: 'Pipeline generation on autopilot.',
    audience: 'growth',
  },
  {
    headline: ['Your growth engine.', 'Fully automated.'],
    subhead: 'Book more calls, close more deals.',
    audience: 'sme',
  },
];

// Mini sparkline SVG component
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
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
      />
    </svg>
  );
};

// Animated grid SVG background
const AnimatedGrid = () => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-[0.03]" 
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <motion.rect 
      width="100%" 
      height="100%" 
      fill="url(#grid)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    {/* Animated connection lines */}
    {[0, 1, 2].map((i) => (
      <motion.circle
        key={i}
        r="4"
        fill="currentColor"
        initial={{ cx: 80 + i * 120, cy: 200, opacity: 0 }}
        animate={{ 
          cx: [80 + i * 120, 120 + i * 120, 80 + i * 120],
          cy: [200, 160 + i * 40, 200],
          opacity: [0, 0.3, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          delay: i * 0.8,
          ease: 'easeInOut',
        }}
      />
    ))}
  </svg>
);

// KPI Card with tilt effect
const KPICard = ({ 
  kpi, 
  index, 
  prefersReducedMotion 
}: { 
  kpi: typeof kpiData[0]; 
  index: number;
  prefersReducedMotion: boolean;
}) => {
  const tilt = usePointerTilt({ maxTilt: 8, disabled: prefersReducedMotion });
  const Icon = kpi.icon;

  return (
    <motion.div
      ref={tilt.ref}
      variants={vibeVariants.kpiEntrance}
      custom={index}
      className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-depth-2"
      style={tilt.style}
      {...tilt.handlers}
    >
      {/* Icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
          <Icon className="w-4 h-4 text-text-secondary" />
        </div>
        <span className="text-caption text-text-muted uppercase tracking-wider">
          {kpi.label}
        </span>
      </div>

      {/* Metric */}
      <div className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
        {kpi.metric}
      </div>

      {/* Sparkline */}
      <Sparkline 
        data={kpi.sparkline} 
        className="h-10 w-full text-charcoal-muted" 
      />
    </motion.div>
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
    trackCTAClick('Book a Tailored Demo', 'hero_visual', '#contact');
  };

  const handleSecondaryCTA = () => {
    trackCTAClick('See ROI Model', 'hero_visual', '#roi');
  };

  return (
    <section 
      className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-2/30 via-background to-background" />
      
      {/* Animated grid (decorative) */}
      <AnimatedGrid />

      <Container size="wide" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Typography */}
          <div className="max-w-xl">
            {/* Headline with line-split reveal */}
            <h1 className="mb-6">
              {copy.headline.map((line, i) => (
                <motion.span
                  key={i}
                  variants={getVariant(vibeVariants.headlineSplit)}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="block font-serif text-display text-text-primary"
                  style={{ transformOrigin: 'left center' }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : motionTokens.duration.base,
                delay: prefersReducedMotion ? 0 : 0.3,
              }}
              className="text-body-lg md:text-xl text-text-secondary mb-8"
            >
              {copy.subhead}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : motionTokens.duration.base,
                delay: prefersReducedMotion ? 0 : 0.4,
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#contact"
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2 hover:shadow-depth-3 transition-shadow"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                Book a Tailored Demo
                <ArrowUpRight className="w-5 h-5" />
              </motion.a>

              <motion.a
                href="#roi"
                onClick={handleSecondaryCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-text-primary font-medium rounded-full border border-border hover:bg-surface-2 transition-colors"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                See ROI Model
              </motion.a>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.6, duration: 0.4 }}
              className="mt-8 flex items-center gap-3 text-caption text-text-muted"
            >
              <Calendar className="w-4 h-4" />
              <span>Free strategy call • No commitment • Results in 30 days</span>
            </motion.div>
          </div>

          {/* Right: Visual Canvas with KPI cards */}
          <motion.div
            variants={vibeVariants.kpiStaggerContainer}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Desktop: Show all 3 KPI cards */}
            <div className="hidden md:grid grid-cols-1 gap-4">
              {kpiData.map((kpi, index) => (
                <KPICard 
                  key={kpi.label} 
                  kpi={kpi} 
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Mobile: Show rotating single KPI */}
            <div className="md:hidden">
              <motion.div
                key={currentKPI}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                <KPICard 
                  kpi={kpiData[currentKPI]} 
                  index={0}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </motion.div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {kpiData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentKPI(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentKPI ? 'bg-charcoal' : 'bg-border'
                    }`}
                    aria-label={`View KPI ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative floating elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-surface-2/50 blur-3xl"
              animate={prefersReducedMotion ? {} : {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-surface-3/50 blur-3xl"
              animate={prefersReducedMotion ? {} : {
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1, duration: 0.4 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-charcoal-muted flex justify-center p-2"
          animate={prefersReducedMotion ? {} : { y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 rounded-full bg-charcoal-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroVisual;
