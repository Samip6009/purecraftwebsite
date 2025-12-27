import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';

const benefits = [
  'Increase qualified appointments by 300%',
  'Reduce cost-per-acquisition by 60%',
  'Scale outreach without scaling headcount',
  'Personalized engagement at any volume',
];

export function TwoColumnSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.5, 
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  };

  return (
    <Section id="about">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.span 
              variants={itemVariants}
              className="text-caption uppercase tracking-wider text-text-muted mb-4 block"
            >
              Why Pure Craft
            </motion.span>
            
            <motion.h2 
              variants={itemVariants}
              className="font-serif text-h2 text-text-primary mb-6 text-balance"
            >
              Built for teams who refuse to settle
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-body-lg text-text-secondary mb-8"
            >
              Traditional outreach is broken. Cold calls get ignored. Generic emails get deleted. 
              Your sales team spends 80% of their time on prospects who'll never convert.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-body text-text-secondary mb-10"
            >
              Pure Craft changes that. Our AI agents engage every lead with the attention and nuance 
              of your best closer—at scale, 24/7, without burnout.
            </motion.p>

            <motion.ul variants={containerVariants} className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <motion.li 
                  key={benefit}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-charcoal mt-0.5 flex-shrink-0" />
                  <span className="text-body text-text-primary">{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              variants={itemVariants}
              href="#contact"
              className="inline-flex items-center gap-2 text-body font-medium text-text-primary link-editorial"
              whileHover={prefersReducedMotion ? {} : { x: 4 }}
            >
              Learn more about our approach
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.33, 1, 0.68, 1] as const }}
            className="relative"
          >
            {/* Glass Card Stack */}
            <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
              {/* Background Card */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 bg-surface-3 rounded-3xl" />
              
              {/* Main Card */}
              <div className="relative h-full glass rounded-3xl p-8 flex flex-col justify-between shadow-depth-4">
                <div>
                  <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mb-6">
                    <span className="font-serif text-2xl">✦</span>
                  </div>
                  <h3 className="font-serif text-h3 text-text-primary mb-2">
                    Samip KC
                  </h3>
                  <p className="text-body text-text-secondary">
                    Founder & AI Automation Specialist
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <span className="text-small text-text-tertiary">Appointments Booked</span>
                    <span className="font-serif text-lg text-text-primary">2,847+</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <span className="text-small text-text-tertiary">Client Satisfaction</span>
                    <span className="font-serif text-lg text-text-primary">98.6%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <span className="text-small text-text-tertiary">Response Rate</span>
                    <span className="font-serif text-lg text-text-primary">4.2x avg</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
