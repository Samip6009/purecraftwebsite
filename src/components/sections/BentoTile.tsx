/**
 * BentoTile.tsx - Individual portfolio tile component
 * Features: Hover lift, metric-first display, click handler
 */
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CaseItem {
  id: string;
  metric: string;
  metricLabel: string;
  title: string;
  client: string;
  industry: string;
  description: string;
}

interface BentoTileProps {
  caseItem: CaseItem;
  featured?: boolean;
  onClick: () => void;
}

export function BentoTile({ caseItem, featured = false, onClick }: BentoTileProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className={`
        group relative w-full text-left p-6 md:p-8 
        bg-card rounded-2xl border border-border 
        shadow-depth-1 hover:shadow-depth-3 
        transition-shadow duration-medium
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${featured ? 'min-h-[320px] md:min-h-[400px]' : 'min-h-[240px]'}
      `}
      whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
      aria-label={`View case study: ${caseItem.title}`}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-surface-2/0 to-surface-3/0 group-hover:from-surface-2/50 group-hover:to-surface-3/30 transition-all duration-medium" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Industry Tag */}
        <span className="text-caption uppercase tracking-wider text-text-muted mb-4">
          {caseItem.industry}
        </span>

        {/* Metric - Hero Element */}
        <div className={`mb-4 ${featured ? 'mb-6' : ''}`}>
          <span className={`
            font-serif font-medium text-text-primary
            ${featured ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'}
          `}>
            {caseItem.metric}
          </span>
          <span className={`
            block text-text-secondary mt-1
            ${featured ? 'text-body-lg' : 'text-body'}
          `}>
            {caseItem.metricLabel}
          </span>
        </div>

        {/* Title & Description */}
        <div className="flex-1">
          <h3 className={`
            font-serif text-text-primary mb-2
            ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}
          `}>
            {caseItem.title}
          </h3>
          
          <p className={`
            text-text-secondary leading-relaxed
            ${featured ? 'text-body-lg max-w-xl' : 'text-body line-clamp-2'}
          `}>
            {caseItem.description}
          </p>
        </div>

        {/* Footer - Client & Arrow */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <span className="text-small text-text-tertiary">
            {caseItem.client}
          </span>
          
          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-border group-hover:border-charcoal-muted group-hover:bg-surface-2 transition-all duration-medium">
            <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default BentoTile;
