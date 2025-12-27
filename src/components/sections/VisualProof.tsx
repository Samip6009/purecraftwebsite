/**
 * VisualProof.tsx - Premium visual proof cards
 * Pure Craft SMMA - Full visual treatment, no plain white
 */
import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, ArrowUpRight, TrendingUp, Users, Calendar, DollarSign, Target } from 'lucide-react';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackEvent } from '@/lib/analytics';

// Visual proof cards with icons for when images aren't available
const proofCards = [
  {
    id: 'proof-1',
    metric: '8.2x',
    label: 'ROAS',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    caption: 'Ad performance',
    alt: 'Digital marketing dashboard showing 8.2x ROAS for Nepal business campaign',
  },
  {
    id: 'proof-2',
    metric: '47%',
    label: 'Close rate',
    icon: Target,
    gradient: 'from-blue-500 to-indigo-600',
    caption: 'Sales efficiency',
    alt: 'Pure Craft marketing agency sales call booking system',
  },
  {
    id: 'proof-3',
    metric: '312',
    label: 'Leads/month',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600',
    caption: 'Lead generation',
    alt: 'Lead generation CRM showing monthly leads for Nepal digital marketing client',
  },
  {
    id: 'proof-4',
    metric: '23',
    label: 'Demos/week',
    icon: Calendar,
    gradient: 'from-orange-500 to-red-600',
    caption: 'Calendar automation',
    alt: 'AI appointment setting calendar with automated bookings',
  },
  {
    id: 'proof-5',
    metric: '$2.4M',
    label: 'Revenue driven',
    icon: DollarSign,
    gradient: 'from-yellow-500 to-orange-600',
    caption: 'Client success',
    alt: 'Revenue growth chart from Pure Craft digital marketing campaigns',
  },
];

const ProofCard = ({ 
  card, 
  index, 
  reduced 
}: { 
  card: typeof proofCards[0]; 
  index: number;
  reduced: boolean;
}) => {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.1 }}
      whileHover={reduced ? {} : { y: -8, scale: 1.02 }}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23fff'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent"
        animate={reduced ? {} : { opacity: [0.6, 0.4, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col">
        {/* Icon */}
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-auto"
          animate={reduced ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
        >
          <Icon className="w-7 h-7 text-primary-foreground" />
        </motion.div>

        {/* Bottom content */}
        <div>
          <span className="text-caption text-primary-foreground/70 uppercase tracking-wider block mb-1">
            {card.label}
          </span>
          <h3 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-2">
            {card.metric}
          </h3>
          <p className="text-small text-primary-foreground/80">
            {card.caption}
          </p>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary-foreground/5" />
    </motion.div>
  );
};

export function VisualProof() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <Section id="results" className="relative overflow-hidden">
      {/* Dark background with texture */}
      <div className="absolute inset-0 bg-charcoal">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient orbs */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
              top: '20%',
              right: '-10%',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
      
      <Container size="wide" className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-3">
            Results-Driven Marketing
          </h2>
          <p className="text-lg text-primary-foreground/60">Performance you can measure</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {proofCards.map((card, i) => (
            <ProofCard key={card.id} card={card} index={i} reduced={prefersReducedMotion} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-charcoal font-medium rounded-full hover:bg-primary-foreground/90 transition-colors"
            onClick={() => trackEvent('cta_click', { cta: 'get_results', location: 'visual_proof' })}
          >
            Get results like these
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}

export default VisualProof;
