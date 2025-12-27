import { motion, Variants, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { Container, Section } from '@/components/layout/SiteShell';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Motion Tokens - Exported for reuse
 * Tuned for perceived luxury: slightly longer durations feel more intentional
 */
export const heroMotionTokens = {
  duration: {
    fast: 0.3,
    base: 0.5,
    slow: 0.7,
    stagger: 0.06,
  },
  ease: {
    out: [0.33, 1, 0.68, 1] as const,      // Smooth deceleration
    inOut: [0.65, 0, 0.35, 1] as const,    // Balanced
    luxury: [0.16, 1, 0.3, 1] as const,    // Extra smooth, premium feel
  },
  delay: {
    headline: 0.1,
    subhead: 0.12,  // 120ms after headline completes
    cta: 0.08,
  },
};

/**
 * Framer Motion Variants - Exported for customization
 */
export const heroVariants = {
  container: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: heroMotionTokens.duration.stagger,
        delayChildren: heroMotionTokens.delay.headline,
      },
    },
  } satisfies Variants,

  headlineLine: {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: heroMotionTokens.duration.slow,
        ease: heroMotionTokens.ease.luxury,
      },
    },
  } satisfies Variants,

  subhead: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: heroMotionTokens.duration.base,
        ease: heroMotionTokens.ease.out,
      },
    },
  } satisfies Variants,

  cta: {
    hidden: { 
      opacity: 0, 
      scale: 0.98,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: heroMotionTokens.duration.base,
        ease: heroMotionTokens.ease.out,
      },
    },
  } satisfies Variants,

  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: heroMotionTokens.duration.fast,
        ease: heroMotionTokens.ease.out,
      },
    },
  } satisfies Variants,

  // Simplified for mobile - single fade
  simpleFade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: heroMotionTokens.duration.base,
        ease: heroMotionTokens.ease.out,
      },
    },
  } satisfies Variants,
};

/**
 * Copy Variants - Alternative headlines and subheads
 */
export const copyVariants = {
  headlines: [
    { line1: "Digital marketing that", line2: "drives real growth." },
    { line1: "AI-powered leads.", line2: "Human results." },
    { line1: "Your growth engine,", line2: "fully automated." },
  ],
  subheads: [
    "Premium digital marketing and AI appointment setting for businesses that demand results.",
    "Strategic campaigns engineered for enterprise ROI and measurable growth.",
    "From awareness to conversion—we build the systems that scale your business.",
  ],
};

interface HeroPremiumProps {
  headlineVariant?: 0 | 1 | 2;
  subheadVariant?: 0 | 1 | 2;
  className?: string;
}

/**
 * HeroPremium Component
 * 
 * Typography-first hero with refined motion choreography.
 * Respects prefers-reduced-motion and simplifies animations on mobile.
 * 
 * Performance notes:
 * - Uses transform + opacity only (GPU accelerated, no layout shift)
 * - No expensive paint operations
 * - 60fps friendly with will-change hints via Framer Motion
 */
export function HeroPremium({ 
  headlineVariant = 0, 
  subheadVariant = 0,
  className = '' 
}: HeroPremiumProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  // On reduced motion or mobile: use simplified animations
  const shouldSimplify = prefersReducedMotion || isMobile;

  const headline = copyVariants.headlines[headlineVariant];
  const subhead = copyVariants.subheads[subheadVariant];

  // Select appropriate variants based on context
  const containerVariant = shouldSimplify 
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : heroVariants.container;
  
  const headlineVariants = shouldSimplify 
    ? heroVariants.simpleFade 
    : heroVariants.headlineLine;
  
  const subheadVariants = shouldSimplify 
    ? heroVariants.simpleFade 
    : heroVariants.subhead;

  const ctaVariants = shouldSimplify 
    ? heroVariants.simpleFade 
    : heroVariants.cta;

  const fadeVariants = shouldSimplify 
    ? heroVariants.simpleFade 
    : heroVariants.fadeUp;

  return (
    <Section 
      spacing="lg" 
      className={`relative overflow-hidden pt-32 md:pt-40 lg:pt-48 ${className}`}
    >
      {/* Subtle ambient elements - CSS only, no images */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--charcoal)) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      
      <Container size="wide" className="relative">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.div 
            variants={fadeVariants}
            className="mb-8 md:mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-caption uppercase tracking-[0.15em] text-text-tertiary">
              Enterprise-Grade AI
            </span>
          </motion.div>

          {/* Split Headline - H1 for SEO */}
          <h1 className="font-serif text-text-primary mb-6 md:mb-8">
            <motion.span 
              variants={headlineVariants}
              className="block text-h1 md:text-display leading-[1.1] tracking-[-0.02em]"
            >
              {headline.line1}
            </motion.span>
            <motion.span 
              variants={headlineVariants}
              className="block text-h1 md:text-display leading-[1.1] tracking-[-0.02em] italic"
            >
              {headline.line2}
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p 
            variants={subheadVariants}
            className="text-body-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed"
          >
            {subhead}
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={ctaVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8"
          >
            {/* Primary CTA */}
            <motion.a
              href="#contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2 hover:shadow-depth-4 transition-shadow duration-medium overflow-hidden"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              aria-label="Get a tailored demo of Pure Craft AI"
            >
              {/* Subtle shine effect on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" aria-hidden="true" />
              <span className="relative">Get a Tailored Demo</span>
              <ArrowUpRight className="relative w-5 h-5 transition-transform duration-medium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            {/* Secondary CTA - Text link */}
            <motion.a
              href="#roi"
              className="group inline-flex items-center gap-2 px-4 py-3 text-body font-medium text-text-secondary hover:text-text-primary transition-colors duration-medium"
              whileHover={prefersReducedMotion ? {} : { x: 2 }}
              aria-label="See the ROI model for Pure Craft AI"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full border border-border group-hover:border-charcoal-muted group-hover:bg-surface-2 transition-all duration-medium">
                <Play className="w-3 h-3 ml-0.5" />
              </span>
              <span className="link-editorial">See the ROI model</span>
            </motion.a>
          </motion.div>

          {/* Microcopy + Trust Logos */}
          <motion.div 
            variants={fadeVariants}
            className="space-y-6"
          >
            {/* Trust statement */}
            <p className="text-small text-text-muted">
              No credit card required · Setup in 15 minutes · 3x average response rate
            </p>

            {/* Logo placeholders */}
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-40">
              {['Forbes', 'TechCrunch', 'YC', 'Bloomberg'].map((logo) => (
                <span 
                  key={logo}
                  className="font-serif text-sm md:text-base text-text-tertiary tracking-wide"
                  aria-label={`Featured in ${logo}`}
                >
                  {logo}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative line - subtle visual anchor */}
        <motion.div 
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 bg-gradient-to-b from-border to-transparent"
          aria-hidden="true"
        />
      </Container>
    </Section>
  );
}

/**
 * Motion Tuning Notes for Perceived Luxury:
 * 
 * 1. DURATION: Slightly longer than "snappy" (0.5-0.7s vs 0.2-0.3s)
 *    - Creates intentional, considered feel
 *    - Avoids feeling rushed or cheap
 * 
 * 2. EASING: Custom cubic-bezier with slow start/end
 *    - [0.16, 1, 0.3, 1] feels silk-smooth
 *    - Quick acceleration, extended deceleration
 * 
 * 3. STAGGER: Very tight (0.06s)
 *    - Creates cohesive cascade, not choppy sequence
 *    - Lines feel connected rather than independent
 * 
 * 4. SCALE: Minimal (0.98 → 1.0)
 *    - Subtle enough to notice subconsciously
 *    - Avoids "bouncy" feeling that cheapens experience
 * 
 * 5. SHADOW: Transition via classes, not animated
 *    - Avoids expensive shadow recalculation per frame
 *    - Still provides visual feedback on interaction
 */

export default HeroPremium;
