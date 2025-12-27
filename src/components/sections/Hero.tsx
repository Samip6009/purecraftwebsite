import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  };

  return (
    <Section spacing="lg" className="relative overflow-hidden pt-32 md:pt-40">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-2/50 to-transparent pointer-events-none" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-40 right-[15%] w-64 h-64 bg-surface-3/30 rounded-full blur-3xl"
        animate={prefersReducedMotion ? {} : { y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-[10%] w-48 h-48 bg-surface-3/20 rounded-full blur-3xl"
        animate={prefersReducedMotion ? {} : { y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <Container size="wide" className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-full text-small font-medium text-text-secondary">
              <Sparkles className="w-4 h-4" />
              AI-Powered Appointment Setting
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-display font-serif text-text-primary mb-6 text-balance"
          >
            Craft conversations that{' '}
            <span className="italic">convert</span>.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-text-secondary max-w-2xl mb-10"
          >
            Pure Craft deploys intelligent AI agents that engage your prospects with 
            human-like precision. No scripts. No missed opportunities. Just qualified 
            appointments on your calendar.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2 hover:shadow-depth-3 transition-all duration-medium"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              Start Your Free Trial
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a
              href="#process"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-text-primary font-medium rounded-full border border-border hover:bg-surface-2 transition-all duration-medium"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              See How It Works
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-border"
          >
            <p className="text-caption uppercase tracking-wider text-text-muted mb-4">
              Trusted by forward-thinking teams
            </p>
            <div className="flex flex-wrap items-center gap-8 opacity-60">
              {['TechCorp', 'Innovate.io', 'FutureScale', 'GrowthLabs'].map((company) => (
                <span 
                  key={company}
                  className="font-serif text-lg text-text-tertiary"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
