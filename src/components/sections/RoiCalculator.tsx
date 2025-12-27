/**
 * RoiCalculator.tsx - Interactive ROI calculator
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackROICalculator } from '@/lib/analytics';

export function RoiCalculator() {
  const prefersReducedMotion = useReducedMotion();
  const [leads, setLeads] = useState(100);
  const [closeRate, setCloseRate] = useState(10);
  const [dealValue, setDealValue] = useState(5000);

  const currentRevenue = leads * (closeRate / 100) * dealValue;
  const improvedRevenue = leads * 3 * ((closeRate * 1.5) / 100) * dealValue;
  const additionalRevenue = improvedRevenue - currentRevenue;

  const handleCalculate = () => {
    trackROICalculator({ leads, closeRate, dealValue }, additionalRevenue);
  };

  return (
    <Section id="roi" className="bg-surface-2/50">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-12"
        >
          <Calculator className="w-10 h-10 text-charcoal mx-auto mb-4" />
          <h2 className="font-serif text-h2 text-text-primary mb-4">
            Calculate Your ROI
          </h2>
          <p className="text-body-lg text-text-secondary">
            See what AI appointment setting could mean for your revenue.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          className="bg-card p-8 rounded-2xl border border-border shadow-depth-2"
        >
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Monthly Leads: {leads}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                onMouseUp={handleCalculate}
                className="w-full accent-charcoal"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Close Rate: {closeRate}%
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                onMouseUp={handleCalculate}
                className="w-full accent-charcoal"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Avg Deal Value: ${dealValue.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                onMouseUp={handleCalculate}
                className="w-full accent-charcoal"
              />
            </div>
          </div>

          <div className="p-6 bg-surface-2 rounded-xl text-center">
            <p className="text-small text-text-muted mb-2">Potential Additional Revenue</p>
            <p className="font-serif text-4xl md:text-5xl text-text-primary">
              ${additionalRevenue.toLocaleString()}<span className="text-xl text-text-muted">/mo</span>
            </p>
          </div>

          <motion.a
            href="#contact"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-medium rounded-full"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            Get Your Custom Projection
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </Container>
    </Section>
  );
}

export default RoiCalculator;
