/**
 * GrowthDiagnostic.tsx - Visual funnel diagnostic (replaces ROI calculator)
 * Pure Craft SMMA - Shows where money leaks, not fake projections
 * Visual funnel animation with before/after
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Users, Phone, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

// Business types with baseline conversion rates
const businessTypes = [
  { id: 'service', name: 'Service Business', baseConversion: 8, baseClose: 20 },
  { id: 'saas', name: 'SaaS / Tech', baseConversion: 5, baseClose: 15 },
  { id: 'ecommerce', name: 'E-commerce', baseConversion: 2, baseClose: 25 },
  { id: 'agency', name: 'Agency', baseConversion: 10, baseClose: 30 },
];

// Lead volume options
const leadVolumes = [
  { id: 'low', label: '< 50/mo', value: 30 },
  { id: 'medium', label: '50-200/mo', value: 100 },
  { id: 'high', label: '200+/mo', value: 250 },
];

// Close rate options
const closeRates = [
  { id: 'low', label: '< 10%', value: 8 },
  { id: 'medium', label: '10-25%', value: 18 },
  { id: 'high', label: '25%+', value: 30 },
];

// Funnel stage component
const FunnelStage = ({
  icon: Icon,
  label,
  valueBefore,
  valueAfter,
  isLeak,
  showAfter,
  delay,
  reduced,
}: {
  icon: React.ElementType;
  label: string;
  valueBefore: number;
  valueAfter: number;
  isLeak: boolean;
  showAfter: boolean;
  delay: number;
  reduced: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduced ? 0 : 0.4, delay }}
      className="relative"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isLeak ? 'bg-red-100' : 'bg-surface-2'
        }`}>
          <Icon className={`w-6 h-6 ${isLeak ? 'text-red-500' : 'text-text-secondary'}`} />
        </div>

        {/* Labels and values */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-small font-medium text-text-primary">{label}</span>
            {isLeak && (
              <span className="flex items-center gap-1 text-[10px] text-red-500 font-medium">
                <AlertTriangle className="w-3 h-3" />
                Leak
              </span>
            )}
          </div>
          
          {/* Before / After bars */}
          <div className="flex items-center gap-3">
            {/* Before */}
            <div className="flex-1">
              <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isLeak ? 'bg-red-300' : 'bg-charcoal-muted'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(valueBefore, 100)}%` }}
                  transition={{ duration: reduced ? 0 : 0.6, delay: delay + 0.2 }}
                />
              </div>
              <span className="text-caption text-text-muted mt-1 block">
                Now: {valueBefore}%
              </span>
            </div>

            {/* After (only if toggled) */}
            <AnimatePresence>
              {showAfter && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1"
                >
                  <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(valueAfter, 100)}%` }}
                      transition={{ duration: reduced ? 0 : 0.6 }}
                    />
                  </div>
                  <span className="text-caption text-green-600 mt-1 block flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Optimized: {valueAfter}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="ml-6 my-2 flex justify-start">
        <ArrowDown className="w-4 h-4 text-text-muted" />
      </div>
    </motion.div>
  );
};

export function GrowthDiagnostic() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [leadVolume, setLeadVolume] = useState(leadVolumes[1]);
  const [closeRate, setCloseRate] = useState(closeRates[1]);
  const [showOptimized, setShowOptimized] = useState(false);

  // Calculate funnel stages
  const funnel = useMemo(() => {
    const leads = leadVolume.value;
    const leadToCall = businessType.baseConversion;
    const callToSale = closeRate.value;
    
    const calls = Math.round(leads * (leadToCall / 100));
    const sales = Math.round(calls * (callToSale / 100));

    // Optimized rates (realistic improvements)
    const optimizedLeadToCall = Math.min(leadToCall * 1.5, 25);
    const optimizedCallToSale = Math.min(callToSale * 1.3, 40);
    
    const optimizedCalls = Math.round(leads * (optimizedLeadToCall / 100));
    const optimizedSales = Math.round(optimizedCalls * (optimizedCallToSale / 100));

    return {
      leads,
      leadToCall,
      calls,
      callToSale,
      sales,
      optimizedLeadToCall,
      optimizedCalls,
      optimizedCallToSale,
      optimizedSales,
    };
  }, [businessType, leadVolume, closeRate]);

  const handleCTA = () => {
    trackCTAClick('Get Real Projection', 'growth_diagnostic', '#contact');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section id="diagnostic" className="bg-background">
      <Container size="narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-h2 text-text-primary mb-2">
            Where's the leak?
          </h2>
          <p className="text-body text-text-secondary">
            See your funnel. Spot the fix.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-depth-1"
          >
            {/* Business type */}
            <div className="mb-6">
              <label className="text-small font-medium text-text-primary mb-3 block">
                Business type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setBusinessType(type);
                      trackEvent('diagnostic_input', { field: 'business_type', value: type.id });
                    }}
                    className={`px-4 py-3 rounded-xl text-small font-medium transition-all ${
                      businessType.id === type.id
                        ? 'bg-charcoal text-primary-foreground'
                        : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lead volume */}
            <div className="mb-6">
              <label className="text-small font-medium text-text-primary mb-3 block">
                Monthly leads
              </label>
              <div className="flex gap-2">
                {leadVolumes.map((vol) => (
                  <button
                    key={vol.id}
                    onClick={() => setLeadVolume(vol)}
                    className={`flex-1 px-4 py-3 rounded-xl text-small font-medium transition-all ${
                      leadVolume.id === vol.id
                        ? 'bg-charcoal text-primary-foreground'
                        : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {vol.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Close rate */}
            <div className="mb-6">
              <label className="text-small font-medium text-text-primary mb-3 block">
                Close rate
              </label>
              <div className="flex gap-2">
                {closeRates.map((rate) => (
                  <button
                    key={rate.id}
                    onClick={() => setCloseRate(rate)}
                    className={`flex-1 px-4 py-3 rounded-xl text-small font-medium transition-all ${
                      closeRate.id === rate.id
                        ? 'bg-charcoal text-primary-foreground'
                        : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {rate.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle optimized view */}
            <button
              onClick={() => setShowOptimized(!showOptimized)}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                showOptimized
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-surface-2 text-text-secondary border border-border'
              }`}
            >
              {showOptimized ? '✓ Showing optimized' : 'Show after Pure Craft'}
            </button>
          </motion.div>

          {/* Right: Visual funnel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-depth-1"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-small font-medium text-text-primary">Your funnel</span>
              <span className="text-caption text-text-muted">
                {funnel.leads} leads → {showOptimized ? funnel.optimizedSales : funnel.sales} sales
              </span>
            </div>

            {/* Funnel visualization */}
            <div className="space-y-2">
              <FunnelStage
                icon={Users}
                label="Leads captured"
                valueBefore={100}
                valueAfter={100}
                isLeak={false}
                showAfter={showOptimized}
                delay={0}
                reduced={prefersReducedMotion}
              />
              
              <FunnelStage
                icon={Phone}
                label="Leads → Calls"
                valueBefore={funnel.leadToCall}
                valueAfter={funnel.optimizedLeadToCall}
                isLeak={funnel.leadToCall < 10}
                showAfter={showOptimized}
                delay={0.15}
                reduced={prefersReducedMotion}
              />
              
              <FunnelStage
                icon={DollarSign}
                label="Calls → Sales"
                valueBefore={funnel.callToSale}
                valueAfter={funnel.optimizedCallToSale}
                isLeak={funnel.callToSale < 20}
                showAfter={showOptimized}
                delay={0.3}
                reduced={prefersReducedMotion}
              />
            </div>

            {/* Result summary */}
            <div className={`mt-6 p-4 rounded-xl ${
              showOptimized ? 'bg-green-50 border border-green-100' : 'bg-surface-2'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-small text-text-secondary">Sales/month</span>
                <div className="flex items-center gap-2">
                  <span className={`font-serif text-2xl ${showOptimized ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    {funnel.sales}
                  </span>
                  {showOptimized && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-serif text-2xl text-green-600"
                    >
                      → {funnel.optimizedSales}
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <motion.button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-3"
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            Get a real projection on call
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </Container>
    </Section>
  );
}

export default GrowthDiagnostic;
