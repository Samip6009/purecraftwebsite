/**
 * HeroAgency.tsx - Premium SMMA Hero
 * Pure Craft - 80% visual, 20% text
 * Features: Video montage, minimal copy, instant authority
 */
import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play, Pause, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { Container } from '@/components/layout/SiteShell';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

// Animated metric cards that cycle
const liveMetrics = [
  { value: '23', label: 'calls booked today', icon: Calendar },
  { value: '8.2x', label: 'avg client ROAS', icon: TrendingUp },
  { value: '47%', label: 'close rate', icon: MessageSquare },
];

// Animated inbox/CRM simulation
const AnimatedInbox = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const leads = [
    { name: 'Sarah M.', company: 'TechFlow', time: 'Just now', status: 'New Lead' },
    { name: 'James K.', company: 'Wellness Co', time: '2m ago', status: 'Call Scheduled' },
    { name: 'Maria L.', company: 'GrowthHQ', time: '5m ago', status: 'Demo Booked' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % leads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-depth-3 overflow-hidden">
      <div className="px-4 py-3 bg-surface-2 border-b border-border flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-caption text-text-muted ml-2">Lead Inbox</span>
      </div>
      <div className="p-2">
        {leads.map((lead, i) => (
          <motion.div
            key={lead.name}
            initial={false}
            animate={{ 
              opacity: i === activeIndex ? 1 : 0.4,
              scale: i === activeIndex ? 1 : 0.98,
              y: i === activeIndex ? 0 : 2,
            }}
            className={`p-3 rounded-lg mb-1 transition-colors ${
              i === activeIndex ? 'bg-surface-2' : 'bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center text-caption font-medium text-text-primary">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <p className="text-small font-medium text-text-primary">{lead.name}</p>
                  <p className="text-caption text-text-muted">{lead.company}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  {lead.status}
                </span>
                <p className="text-[10px] text-text-muted mt-1">{lead.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Calendar filling animation
const AnimatedCalendar = () => {
  const [filledSlots, setFilledSlots] = useState<number[]>([]);
  const slots = Array(12).fill(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilledSlots((prev) => {
        if (prev.length >= 8) return [Math.floor(Math.random() * 12)];
        const available = slots.map((_, i) => i).filter((i) => !prev.includes(i));
        if (available.length === 0) return prev;
        const next = available[Math.floor(Math.random() * available.length)];
        return [...prev, next];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-depth-3 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-small font-medium text-text-primary">This Week</span>
        <span className="text-caption text-green-600 font-medium">{filledSlots.length} booked</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: filledSlots.includes(i) 
                ? 'hsl(var(--charcoal))' 
                : 'hsl(var(--surface-2))',
              scale: filledSlots.includes(i) ? [1, 1.1, 1] : 1,
            }}
            className="h-8 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

// Live metric ticker
const MetricTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % liveMetrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = liveMetrics[index];
  const Icon = current.icon;

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-depth-2 p-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="font-serif text-2xl text-text-primary">{current.value}</p>
        <p className="text-caption text-text-muted">{current.label}</p>
      </div>
    </motion.div>
  );
};

export function HeroAgency() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrimaryCTA = () => {
    trackCTAClick('Book Demo', 'hero_agency', '#contact');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSecondaryCTA = () => {
    trackCTAClick('See How It Works', 'hero_agency', '#services');
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        trackEvent('media_played', { mediaId: 'hero-reel' });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 md:pt-24 overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2/40 via-background to-background" />

      <Container size="wide" className="relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Minimal Copy (20%) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
              className="font-serif text-display text-text-primary mb-4"
            >
              We turn ads<br />into sales.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.15 }}
              className="text-xl text-text-secondary mb-8"
            >
              Performance marketing. Real leads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                onClick={handlePrimaryCTA}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-3"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                Book Demo
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={handleSecondaryCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-text-primary font-medium rounded-full border border-border hover:bg-surface-2 transition-colors"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                See How It Works
              </motion.button>
            </motion.div>
          </div>

          {/* RIGHT: Visual Montage (80%) */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
              className="relative"
            >
              {/* Main video/visual area */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-2 shadow-depth-4">
                {/* Video placeholder with overlay visuals */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  poster="/assets/photos/agency-hero-poster.jpg"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/assets/videos/agency-reel.webm" type="video/webm" />
                  <source src="/assets/videos/agency-reel.mp4" type="video/mp4" />
                </video>

                {/* Gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-charcoal/10" />

                {/* Play button */}
                <button
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label={isPlaying ? 'Pause' : 'Play video'}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary-foreground/95 flex items-center justify-center shadow-depth-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-charcoal" />
                    ) : (
                      <Play className="w-8 h-8 text-charcoal ml-1" />
                    )}
                  </motion.div>
                </button>

                {/* Bottom caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-primary-foreground/90 font-medium">Watch how we work →</p>
                </div>
              </div>

              {/* Floating UI elements */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-4 top-8 w-64 hidden lg:block"
              >
                <AnimatedInbox />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -right-4 top-1/3 w-48 hidden lg:block"
              >
                <AnimatedCalendar />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-4 right-8 hidden lg:block"
              >
                <MetricTicker />
              </motion.div>

              {/* Mobile: Show stacked cards below video */}
              <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <AnimatedInbox />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroAgency;
