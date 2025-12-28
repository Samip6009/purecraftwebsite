/**
 * HeroAgency.tsx - Premium Full-Visual Hero
 * Pure Craft SMMA - Full visual takeover with floating UI
 * 80% visual, 20% text - instant authority
 */
import { useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Calendar, TrendingUp, Users, Zap } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

// Animated KPI card
const FloatingKPI = ({ 
  value, 
  label, 
  icon: Icon, 
  delay, 
  position,
  reduced 
}: { 
  value: string; 
  label: string; 
  icon: React.ElementType;
  delay: number;
  position: string;
  reduced: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    className={`absolute ${position} z-20`}
  >
    <motion.div 
      className="bg-background rounded-2xl border border-border shadow-md p-4 md:p-5"
      animate={reduced ? {} : { y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-2 flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-text-primary" />
        </div>
        <div>
          <p className="font-serif text-xl md:text-2xl text-text-primary font-medium">{value}</p>
          <p className="text-caption text-text-muted">{label}</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Animated lead notification
const LeadNotification = ({ reduced }: { reduced: boolean }) => {
  const [currentLead, setCurrentLead] = useState(0);
  const leads = [
    { name: 'Sarah M.', action: 'booked a demo', time: 'Just now' },
    { name: 'James K.', action: 'requested callback', time: '2m ago' },
    { name: 'Priya S.', action: 'started trial', time: '5m ago' },
  ];

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setCurrentLead((prev) => (prev + 1) % leads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reduced]);

  const lead = leads[currentLead];

  return (
    <motion.div
      key={currentLead}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-background rounded-2xl border border-border shadow-md p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-lg">✓</span>
        </div>
        <div>
          <p className="text-small font-medium text-text-primary">{lead.name} {lead.action}</p>
          <p className="text-caption text-text-muted">{lead.time}</p>
        </div>
      </div>
    </motion.div>
  );
};

export function HeroAgency() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  // Remove scroll-based transforms for performance
  // Only use them if NOT on mobile and NOT reduced-motion
  const shouldUseScrollTransforms = !prefersReducedMotion && typeof window !== 'undefined' && window.innerWidth >= 1024;
  const { scrollY } = useScroll();
  const backgroundY = shouldUseScrollTransforms ? useTransform(scrollY, [0, 500], [0, 150]) : 0;
  const opacity = shouldUseScrollTransforms ? useTransform(scrollY, [0, 400], [1, 0]) : 1;

  const handlePrimaryCTA = () => {
    trackCTAClick('Book Demo', 'hero_agency', '#contact');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen animated background */}
      <div className="absolute inset-0">
        {/* Base gradient mesh */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: prefersReducedMotion ? 0 : backgroundY }}
        >
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-charcoal" />
          
          {/* Animated gradient orbs - GPU accelerated only */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  top: '-20%',
                  right: '-10%',
                  willChange: 'transform',
                }}
                animate={{ 
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                  bottom: '-10%',
                  left: '-5%',
                  willChange: 'transform',
                }}
                animate={{ 
                  scale: [1, 1.12, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}
          
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-32"
        style={{ opacity: prefersReducedMotion ? 1 : opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[60vh]">
          {/* Left: Minimal text - Sequenced animations */}
          <div className="order-2 lg:order-1">
            {/* Headline entrance */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {/* Hidden H1 for SEO */}
              <h1 className="sr-only">Pure Craft — Digital Marketing Agency in Nepal</h1>
              
              {/* Visual headline */}
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95] block mb-6">
                AI Marketing<br />
                <span className="text-primary-foreground/60">for Real Growth</span>
              </span>
            </motion.div>
            
            {/* Subheadline entrance (staggered) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-lg md:text-xl text-primary-foreground/70 max-w-md mb-8"
            >
              Performance-focused digital marketing in Nepal.
            </motion.p>
            
            {/* CTA button entrance (final stagger) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-charcoal font-semibold rounded-full shadow-depth-4"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                Book Demo
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Visual dashboard mockup area */}
          <div className="order-1 lg:order-2 relative">
            {/* Floating KPI cards */}
            <FloatingKPI 
              value="8.2x" 
              label="Avg ROAS" 
              icon={TrendingUp}
              delay={0.3}
              position="top-0 left-0 md:-left-8"
              reduced={prefersReducedMotion}
            />
            <FloatingKPI 
              value="47%" 
              label="Close Rate" 
              icon={Users}
              delay={0.5}
              position="top-24 right-0 md:-right-4"
              reduced={prefersReducedMotion}
            />
            <FloatingKPI 
              value="23" 
              label="Demos/Week" 
              icon={Calendar}
              delay={0.7}
              position="bottom-20 left-4 md:left-12"
              reduced={prefersReducedMotion}
            />
            
            {/* Center visual: Glowing dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: prefersReducedMotion ? 0 : 0.8 }}
              className="relative mx-auto max-w-sm lg:max-w-md"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary-foreground/10 rounded-3xl blur-3xl" />
              
              {/* Dashboard card */}
              <div className="relative bg-charcoal/80 rounded-3xl border border-primary-foreground/10 p-6 md:p-8 shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-small font-medium text-primary-foreground">Live Performance</span>
                  </div>
                  <span className="text-caption text-primary-foreground/60">Today</span>
                </div>
                
                {/* Chart visualization */}
                <div className="h-32 md:h-40 flex items-end gap-2 mb-6">
                  {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary-foreground/40 to-primary-foreground/80 rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ 
                        delay: 0.8 + i * 0.1, 
                        duration: prefersReducedMotion ? 0 : 0.6,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    />
                  ))}
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Leads', value: '312' },
                    { label: 'Calls', value: '47' },
                    { label: 'Revenue', value: '$24k' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: prefersReducedMotion ? 0 : 0.4 }}
                      className="text-center"
                    >
                      <p className="font-serif text-lg md:text-xl text-primary-foreground">{stat.value}</p>
                      <p className="text-caption text-primary-foreground/60">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Lead notification - positioned at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: prefersReducedMotion ? 0 : 0.5 }}
              className="absolute -bottom-4 right-0 md:right-8 hidden md:block"
            >
              <LeadNotification reduced={prefersReducedMotion} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2"
          animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroAgency;
