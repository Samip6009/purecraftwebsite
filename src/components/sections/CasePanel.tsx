/**
 * CasePanel.tsx - Slide-over panel for case study details
 * Features: Full case breakdown, results list, prefill CTA
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { vibeVariants } from '@/lib/vibeMotion';
import { trackCTAClick } from '@/lib/analytics';

interface CaseItem {
  id: string;
  metric: string;
  metricLabel: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  results: string[];
  challenge: string;
  solution: string;
  timeline: string;
}

interface CasePanelProps {
  caseItem: CaseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CasePanel({ caseItem, isOpen, onClose }: CasePanelProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!caseItem) return null;

  const handleGetResultClick = () => {
    trackCTAClick('Get This Result', 'case_panel', '#contact');
    // Close panel and scroll to contact
    onClose();
    // Could also prefill form with case reference
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slideVariants = prefersReducedMotion 
    ? vibeVariants.reducedMotion 
    : vibeVariants.slideOverOpen;

  const backdropVariants = prefersReducedMotion
    ? vibeVariants.reducedMotion
    : vibeVariants.backdropFade;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="case-panel-title">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-background shadow-depth-4 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-background/95 backdrop-blur-sm border-b border-border">
              <span className="text-caption uppercase tracking-wider text-text-muted">
                Case Study
              </span>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Industry & Client */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-surface-2 rounded-full text-caption text-text-secondary">
                  {caseItem.industry}
                </span>
                <span className="text-caption text-text-muted">•</span>
                <span className="text-caption text-text-muted">
                  {caseItem.timeline}
                </span>
              </div>

              {/* Hero Metric */}
              <div className="mb-6">
                <span className="font-serif text-6xl font-medium text-text-primary">
                  {caseItem.metric}
                </span>
                <span className="block text-body-lg text-text-secondary mt-1">
                  {caseItem.metricLabel}
                </span>
              </div>

              {/* Title & Description */}
              <h2 id="case-panel-title" className="font-serif text-2xl text-text-primary mb-4">
                {caseItem.title}
              </h2>
              <p className="text-body-lg text-text-secondary mb-8 leading-relaxed">
                {caseItem.description}
              </p>

              {/* Challenge */}
              <div className="mb-8">
                <h3 className="font-serif text-lg text-text-primary mb-3">
                  The Challenge
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  {caseItem.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-8">
                <h3 className="font-serif text-lg text-text-primary mb-3">
                  Our Approach
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
                  {caseItem.solution}
                </p>
              </div>

              {/* Results */}
              <div className="mb-10">
                <h3 className="font-serif text-lg text-text-primary mb-4">
                  Key Results
                </h3>
                <ul className="space-y-3">
                  {caseItem.results.map((result, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-charcoal mt-0.5 flex-shrink-0" />
                      <span className="text-body text-text-secondary">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA - Get This Result */}
              <div className="sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-background via-background to-transparent">
                <motion.button
                  onClick={handleGetResultClick}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2 hover:shadow-depth-3 transition-all duration-medium"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  Get This Result
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
                <p className="text-caption text-text-muted text-center mt-3">
                  Free strategy call • No commitment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CasePanel;
