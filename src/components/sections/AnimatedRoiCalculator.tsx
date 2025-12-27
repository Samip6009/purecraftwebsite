/**
 * AnimatedRoiCalculator.tsx - Visual-first ROI cockpit
 * Pure Craft — Visual ROI & Media upgrade
 * Features: Scenario presets, time horizon, PDF export, visual charts, animated counters
 */
import { useState, useMemo, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download, Sparkles, Copy, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Container, Section } from '@/components/layout/SiteShell';
import { vibeVariants } from '@/lib/vibeMotion';
import { trackROICalculator, trackCTAClick, trackEvent } from '@/lib/analytics';

// Lazy load recharts for performance
const LazyCharts = lazy(() => import('./RoiCharts'));

// Scenario presets with industry-specific defaults
const SCENARIO_PRESETS = {
  saas: { 
    name: 'SaaS', 
    dealValue: 2000, 
    leads: 150, 
    conversion: 8, 
    uplift: 25,
    description: 'Software subscription businesses'
  },
  ecommerce: { 
    name: 'eCommerce', 
    dealValue: 120, 
    leads: 500, 
    conversion: 3, 
    uplift: 30,
    description: 'Online retail and D2C brands'
  },
  b2b: { 
    name: 'B2B Services', 
    dealValue: 8000, 
    leads: 50, 
    conversion: 15, 
    uplift: 20,
    description: 'High-value service contracts'
  },
  agency: { 
    name: 'Agency', 
    dealValue: 5000, 
    leads: 80, 
    conversion: 12, 
    uplift: 35,
    description: 'Marketing & creative agencies'
  },
} as const;

type ScenarioKey = keyof typeof SCENARIO_PRESETS;
type TimeHorizon = 'monthly' | 'quarterly' | 'yearly';

// Fallback loader for charts
const ChartLoader = () => (
  <div className="h-[180px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-charcoal-muted border-t-transparent rounded-full animate-spin" />
  </div>
);

// Enhanced slider with icon and live value bubble
const VisualSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  formatValue = (v: number) => v.toLocaleString(),
  icon: Icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (v: number) => string;
  icon?: React.ElementType;
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center gap-2 text-small font-medium text-text-primary">
          {Icon && <Icon className="w-4 h-4 text-text-muted" />}
          {label}
        </label>
        <div className="px-3 py-1 bg-surface-2 rounded-lg text-small font-semibold text-text-primary tabular-nums">
          {prefix}{formatValue(value)}{suffix}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-charcoal 
            [&::-webkit-slider-thumb]:shadow-depth-2
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-charcoal
            [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, hsl(var(--charcoal)) 0%, hsl(var(--charcoal)) ${percent}%, hsl(var(--surface-3)) ${percent}%, hsl(var(--surface-3)) 100%)`,
          }}
        />
      </div>
    </div>
  );
};

// Animated counter display with currency formatting
const AnimatedMetric = ({ 
  value, 
  prefix = '',
  suffix = '',
  size = 'default',
  enabled = true,
}: { 
  value: number;
  prefix?: string;
  suffix?: string;
  size?: 'default' | 'large';
  enabled?: boolean;
}) => {
  const { displayValue } = useAnimatedCounter(value, { 
    duration: 600, 
    enabled,
  });

  return (
    <span className={`font-serif tabular-nums ${
      size === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
    }`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

// Delta badge with confetti animation
const DeltaBadge = ({ 
  value, 
  percent,
  showConfetti,
}: { 
  value: number;
  percent: number;
  showConfetti: boolean;
}) => {
  const isPositive = value >= 0;
  
  return (
    <motion.div 
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full ${
        isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
      }`}
      animate={showConfetti ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
      <span className={`text-small font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
        +${value.toLocaleString()}
      </span>
      <span className={`text-caption ${isPositive ? 'text-green-600/70' : 'text-red-600/70'}`}>
        (+{percent.toFixed(0)}%)
      </span>
      
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Preset pill selector
const PresetSelector = ({
  selected,
  onSelect,
}: {
  selected: ScenarioKey | null;
  onSelect: (key: ScenarioKey) => void;
}) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {(Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).map((key) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className={`px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
          selected === key 
            ? 'bg-charcoal text-primary-foreground' 
            : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
        }`}
      >
        {SCENARIO_PRESETS[key].name}
      </button>
    ))}
  </div>
);

// Time horizon toggle
const TimeHorizonToggle = ({
  value,
  onChange,
}: {
  value: TimeHorizon;
  onChange: (v: TimeHorizon) => void;
}) => (
  <div className="flex gap-1 p-1 bg-surface-2 rounded-full">
    {(['monthly', 'quarterly', 'yearly'] as TimeHorizon[]).map((horizon) => (
      <button
        key={horizon}
        onClick={() => onChange(horizon)}
        className={`flex-1 py-2 px-3 rounded-full text-caption font-medium transition-all ${
          value === horizon 
            ? 'bg-card shadow-depth-1 text-text-primary' 
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        {horizon.charAt(0).toUpperCase() + horizon.slice(1)}
      </button>
    ))}
  </div>
);

export function AnimatedRoiCalculator() {
  const prefersReducedMotion = useReducedMotion();
  
  // Input state
  const [dealValue, setDealValue] = useState(5000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(100);
  const [conversionRate, setConversionRate] = useState(10);
  const [upliftPercent, setUpliftPercent] = useState(25);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('monthly');
  const [selectedPreset, setSelectedPreset] = useState<ScenarioKey | null>(null);
  
  // Comparison mode
  const [showComparison, setShowComparison] = useState(true);
  
  // Confetti state
  const [prevProjected, setPrevProjected] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Apply preset
  const applyPreset = useCallback((key: ScenarioKey) => {
    const preset = SCENARIO_PRESETS[key];
    setDealValue(preset.dealValue);
    setLeadsPerMonth(preset.leads);
    setConversionRate(preset.conversion);
    setUpliftPercent(preset.uplift);
    setSelectedPreset(key);
    trackEvent('roi_preset_selected', { preset: key });
  }, []);

  // Time multiplier
  const timeMultiplier: number = timeHorizon === 'yearly' ? 12 : timeHorizon === 'quarterly' ? 3 : 1;

  // Calculations
  const calculations = useMemo(() => {
    const currentRevenue = leadsPerMonth * (conversionRate / 100) * dealValue * timeMultiplier;
    const projectedLeads = leadsPerMonth * 3; // 3x more leads from AI
    const projectedConversion = conversionRate * (1 + upliftPercent / 100);
    const projectedRevenue = projectedLeads * (projectedConversion / 100) * dealValue * timeMultiplier;
    const additionalRevenue = projectedRevenue - currentRevenue;
    const percentIncrease = currentRevenue > 0 ? (additionalRevenue / currentRevenue) * 100 : 0;
    const upliftRatio = currentRevenue > 0 ? projectedRevenue / currentRevenue : 1;

    return {
      currentRevenue,
      projectedRevenue,
      additionalRevenue,
      percentIncrease,
      upliftRatio,
    };
  }, [dealValue, leadsPerMonth, conversionRate, upliftPercent, timeMultiplier]);

  // Confetti on big jumps
  useMemo(() => {
    const change = Math.abs(calculations.projectedRevenue - prevProjected) / Math.max(prevProjected, 1);
    if (change > 0.1 && prevProjected > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    setPrevProjected(calculations.projectedRevenue);
  }, [calculations.projectedRevenue, prevProjected]);

  // Analytics
  const emitAnalytics = useCallback(() => {
    trackROICalculator(
      { dealValue, leadsPerMonth, conversionRate, upliftPercent, timeHorizon },
      calculations.additionalRevenue
    );
  }, [dealValue, leadsPerMonth, conversionRate, upliftPercent, timeHorizon, calculations.additionalRevenue]);

  const handleBookDemo = () => {
    emitAnalytics();
    trackCTAClick('Book Demo with Projection', 'roi_calculator', '#contact');
    
    // Create prefill data for contact form
    const prefillData = {
      source: 'roi_calculator',
      projection: calculations.projectedRevenue,
      timeHorizon,
      preset: selectedPreset,
    };
    
    // Store in sessionStorage for contact form to pick up
    sessionStorage.setItem('roiPrefill', JSON.stringify(prefillData));
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportPDF = () => {
    trackEvent('roi_exported', { format: 'pdf', ...calculations });
    // PDF export stub - would use html2canvas + jsPDF
    alert('PDF export coming soon! Your projection: $' + calculations.projectedRevenue.toLocaleString());
  };

  const handleCopyProjection = () => {
    const text = `Pure Craft ROI Projection:
Current Revenue: $${calculations.currentRevenue.toLocaleString()}/${timeHorizon}
Projected Revenue: $${calculations.projectedRevenue.toLocaleString()}/${timeHorizon}
Additional Revenue: +$${calculations.additionalRevenue.toLocaleString()} (+${calculations.percentIncrease.toFixed(0)}%)`;
    
    navigator.clipboard.writeText(text);
    trackEvent('roi_copied', { timeHorizon });
  };

  return (
    <Section id="roi" className="bg-surface-2/30">
      <Container size="wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
          className="text-center mb-10"
        >
          <span className="text-caption uppercase tracking-wider text-text-muted mb-3 block">
            Revenue Projection
          </span>
          <h2 className="font-serif text-h2 text-text-primary mb-3">
            See Your Growth
          </h2>
          <p className="text-body text-text-secondary max-w-md mx-auto">
            Adjust the sliders and watch your revenue transform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
          className="grid lg:grid-cols-2 gap-6 lg:gap-10"
        >
          {/* Left: Inputs */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-depth-1">
            <h3 className="font-serif text-xl text-text-primary mb-4">Your Numbers</h3>
            
            {/* Scenario Presets */}
            <PresetSelector selected={selectedPreset} onSelect={applyPreset} />
            
            <VisualSlider
              label="Average Deal Value"
              value={dealValue}
              onChange={(v) => { setDealValue(v); setSelectedPreset(null); }}
              min={100}
              max={50000}
              step={100}
              prefix="$"
              icon={DollarSign}
            />

            <VisualSlider
              label="Leads per Month"
              value={leadsPerMonth}
              onChange={(v) => { setLeadsPerMonth(v); setSelectedPreset(null); }}
              min={10}
              max={1000}
              step={10}
              icon={Users}
            />

            <VisualSlider
              label="Current Close Rate"
              value={conversionRate}
              onChange={(v) => { setConversionRate(v); setSelectedPreset(null); }}
              min={1}
              max={50}
              suffix="%"
              icon={Percent}
            />

            <VisualSlider
              label="Expected Improvement"
              value={upliftPercent}
              onChange={(v) => { setUpliftPercent(v); setSelectedPreset(null); }}
              min={5}
              max={100}
              suffix="%"
              icon={TrendingUp}
            />

            {/* Time Horizon */}
            <div className="mt-6">
              <label className="text-small font-medium text-text-primary mb-2 block">
                Time Horizon
              </label>
              <TimeHorizonToggle value={timeHorizon} onChange={setTimeHorizon} />
            </div>
          </div>

          {/* Right: Visual Results */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-depth-1">
            {/* Main metric */}
            <div className="text-center mb-6">
              <span className="text-caption text-text-muted uppercase tracking-wider block mb-2">
                Projected {timeHorizon.charAt(0).toUpperCase() + timeHorizon.slice(1)} Revenue
              </span>
              <div 
                className="text-text-primary"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <AnimatedMetric 
                  value={calculations.projectedRevenue}
                  prefix="$"
                  size="large"
                  enabled={!prefersReducedMotion}
                />
              </div>
              
              <div className="mt-3">
                <DeltaBadge 
                  value={calculations.additionalRevenue} 
                  percent={calculations.percentIncrease}
                  showConfetti={showConfetti}
                />
              </div>
            </div>

            {/* Comparison toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-caption text-text-muted">Show comparison</span>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  showComparison ? 'bg-charcoal' : 'bg-surface-3'
                }`}
                aria-label="Toggle comparison view"
              >
                <div className={`w-4 h-4 bg-primary-foreground rounded-full transition-transform mx-1 ${
                  showComparison ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Charts */}
            <Suspense fallback={<ChartLoader />}>
              <LazyCharts 
                currentRevenue={calculations.currentRevenue}
                projectedRevenue={calculations.projectedRevenue}
                upliftRatio={calculations.upliftRatio}
                prefersReducedMotion={prefersReducedMotion}
                showComparison={showComparison}
              />
            </Suspense>

            {/* CTAs */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <motion.button
                onClick={handleBookDemo}
                className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2 text-small"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                Book Demo
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleCopyProjection}
                className="inline-flex items-center justify-center gap-1 px-3 py-3 border border-border text-text-primary rounded-full hover:bg-surface-2 transition-colors text-small"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                aria-label="Copy projection"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>

            <motion.button
              onClick={handleExportPDF}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-text-secondary font-medium rounded-full hover:bg-surface-2 transition-colors text-small"
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
            >
              <Download className="w-4 h-4" />
              Export PDF Report
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default AnimatedRoiCalculator;
