/**
 * GrowthDiagnostic.tsx - Visual funnel diagnostic
 * Pure Craft SMMA - Animated funnel visualization
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Users, Phone, DollarSign, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackCTAClick, trackEvent } from '@/lib/analytics';

const businessTypes = [
  { id: 'service', name: 'Service', baseConversion: 8, baseClose: 20 },
  { id: 'saas', name: 'SaaS', baseConversion: 5, baseClose: 15 },
  { id: 'ecommerce', name: 'E-comm', baseConversion: 2, baseClose: 25 },
  { id: 'agency', name: 'Agency', baseConversion: 10, baseClose: 30 },
];

const leadVolumes = [
  { id: 'low', label: '<50/mo', value: 30 },
  { id: 'medium', label: '50-200', value: 100 },
  { id: 'high', label: '200+', value: 250 },
];

const closeRates = [
  { id: 'low', label: '<10%', value: 8 },
  { id: 'medium', label: '10-25%', value: 18 },
  { id: 'high', label: '25%+', value: 30 },
];

// Visual funnel stage
const FunnelBar = ({
  label,
  icon: Icon,
  valueBefore,
  valueAfter,
  showAfter,
  isLeak,
  delay,
  reduced,
}: {
  label: string;
  icon: React.ElementType;
  valueBefore: number;
  valueAfter: number;
  showAfter: boolean;
  isLeak: boolean;
  delay: number;
  reduced: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: reduced ? 0 : 0.4, delay }}
    className="mb-4"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLeak ? 'bg-red-100' : 'bg-surface-3'}`}>
        <Icon className={`w-5 h-5 ${isLeak ? 'text-red-500' : 'text-text-secondary'}`} />
      </div>
      <span className="text-small font-medium text-text-primary">{label}</span>
      {isLeak && (
        <span className="flex items-center gap-1 text-caption text-red-500">
          <AlertTriangle className="w-3 h-3" /> Leak
        </span>
      )}
    </div>
    
    <div className="flex gap-3">
      {/* Before */}
      <div className="flex-1">
        <div className="h-4 bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isLeak ? 'bg-red-400' : 'bg-charcoal-muted'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(valueBefore, 100)}%` }}
            transition={{ duration: reduced ? 0 : 0.6, delay: delay + 0.2 }}
          />
        </div>
        <span className="text-caption text-text-muted mt-1 block">Now: {valueBefore}%</span>
      </div>

      {/* After */}
      <AnimatePresence>
        {showAfter && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1"
          >
            <div className="h-4 bg-surface-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(valueAfter, 100)}%` }}
                transition={{ duration: reduced ? 0 : 0.6 }}
              />
            </div>
            <span className="text-caption text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {valueAfter}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export function GrowthDiagnostic() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [leadVolume, setLeadVolume] = useState(leadVolumes[1]);
  const [closeRate, setCloseRate] = useState(closeRates[1]);
  const [showOptimized, setShowOptimized] = useState(false);

  const funnel = useMemo(() => {
    const leads = leadVolume.value;
    const leadToCall = businessType.baseConversion;
    const callToSale = closeRate.value;
    
    const calls = Math.round(leads * (leadToCall / 100));
    const sales = Math.round(calls * (callToSale / 100));

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
    <Section id="diagnostic" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-background to-surface-3">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <Container size="narrow" className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary mb-3">
            Find Your Leaks
          </h2>
          <p className="text-lg text-text-secondary">See where you're losing revenue</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-depth-2"
          >
            {/* Business type */}
            <div className="mb-6">
              <label className="text-small font-medium text-text-primary mb-3 block">Business</label>
              <div className="grid grid-cols-4 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBusinessType(type)}
                    className={`px-3 py-2 rounded-xl text-caption font-medium transition-all ${
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
              <label className="text-small font-medium text-text-primary mb-3 block">Leads</label>
              <div className="flex gap-2">
                {leadVolumes.map((vol) => (
                  <button
                    key={vol.id}
                    onClick={() => setLeadVolume(vol)}
                    className={`flex-1 px-3 py-2 rounded-xl text-caption font-medium transition-all ${
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
              <label className="text-small font-medium text-text-primary mb-3 block">Close Rate</label>
              <div className="flex gap-2">
                {closeRates.map((rate) => (
                  <button
                    key={rate.id}
                    onClick={() => setCloseRate(rate)}
                    className={`flex-1 px-3 py-2 rounded-xl text-caption font-medium transition-all ${
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

            {/* Toggle */}
            <button
              onClick={() => setShowOptimized(!showOptimized)}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                showOptimized
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-surface-2 text-text-secondary border border-border'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {showOptimized ? 'Showing Optimized' : 'Show After Pure Craft'}
            </button>
          </motion.div>

          {/* Right: Funnel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-depth-2"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-small font-medium text-text-primary">Your Funnel</span>
              <span className="text-caption text-text-muted">
                {funnel.leads} → {showOptimized ? funnel.optimizedSales : funnel.sales} sales
              </span>
            </div>

            <FunnelBar
              icon={Users}
              label="Lead Capture"
              valueBefore={100}
              valueAfter={100}
              showAfter={showOptimized}
              isLeak={false}
              delay={0}
              reduced={prefersReducedMotion}
            />
            
            <FunnelBar
              icon={Phone}
              label="Lead → Call"
              valueBefore={funnel.leadToCall}
              valueAfter={funnel.optimizedLeadToCall}
              showAfter={showOptimized}
              isLeak={funnel.leadToCall < 10}
              delay={0.15}
              reduced={prefersReducedMotion}
            />
            
            <FunnelBar
              icon={DollarSign}
              label="Call → Sale"
              valueBefore={funnel.callToSale}
              valueAfter={funnel.optimizedCallToSale}
              showAfter={showOptimized}
              isLeak={funnel.callToSale < 20}
              delay={0.3}
              reduced={prefersReducedMotion}
            />

            {/* Result */}
            <div className={`mt-6 p-4 rounded-xl ${showOptimized ? 'bg-green-50 border border-green-100' : 'bg-surface-2'}`}>
              <div className="flex items-center justify-between">
                <span className="text-small text-text-secondary">Monthly Sales</span>
                <div className="flex items-center gap-3">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal text-primary-foreground font-semibold rounded-full shadow-depth-3"
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            Get Your Real Projection
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </Container>
    </Section>
  );
}

export default GrowthDiagnostic;
