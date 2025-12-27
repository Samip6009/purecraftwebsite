/**
 * AnimatedRoiCalculator.tsx - Realistic ROI Cockpit with range projections
 * Pure Craft — Visual ROI & Media upgrade
 * Features: Low/Realistic/High ranges, assumptions panel, sensitivity slider, industry presets
 */
import { useState, useMemo, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download, Info, ChevronDown, ChevronUp, AlertTriangle, Copy, TrendingUp, Users, DollarSign, Percent, HelpCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Container, Section } from '@/components/layout/SiteShell';
import { vibeVariants } from '@/lib/vibeMotion';
import { trackROICalculator, trackCTAClick, trackEvent } from '@/lib/analytics';

// Lazy load recharts for performance
const LazyCharts = lazy(() => import('./RoiCharts'));

// Industry presets with REALISTIC uplift caps
const INDUSTRY_PRESETS = {
  saas: { 
    name: 'SaaS', 
    dealValue: 2400, 
    leads: 120, 
    baseConversion: 6,
    upliftCaps: { conservative: 10, realistic: 18, aggressive: 28 },
    description: 'B2B software subscriptions',
  },
  ecommerce: { 
    name: 'eCommerce', 
    dealValue: 85, 
    leads: 800, 
    baseConversion: 2.5,
    upliftCaps: { conservative: 8, realistic: 15, aggressive: 25 },
    description: 'Online retail, D2C brands',
  },
  b2b: { 
    name: 'B2B Services', 
    dealValue: 12000, 
    leads: 40, 
    baseConversion: 12,
    upliftCaps: { conservative: 6, realistic: 12, aggressive: 22 },
    description: 'High-value contracts',
  },
  agency: { 
    name: 'Agency', 
    dealValue: 6000, 
    leads: 60, 
    baseConversion: 10,
    upliftCaps: { conservative: 8, realistic: 16, aggressive: 26 },
    description: 'Marketing & creative services',
  },
} as const;

type IndustryKey = keyof typeof INDUSTRY_PRESETS;
type TimeHorizon = 'monthly' | 'quarterly' | 'yearly';
type UpliftLevel = 'conservative' | 'realistic' | 'aggressive';

// Chart loader
const ChartLoader = () => (
  <div className="h-[160px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-charcoal-muted border-t-transparent rounded-full animate-spin" />
  </div>
);

// Currency formatter
export const formatCurrency = (value: number, decimals = 0): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(decimals > 0 ? 1 : 0)}K`;
  return `$${value.toFixed(decimals)}`;
};

// Projection formula - AUDITABLE
export const calculateProjection = (
  leads: number,
  conversionRate: number,
  dealValue: number,
  upliftPercent: number,
  timeMultiplier: number
): number => {
  // Formula: revenue = leads × (conversion/100) × dealValue × (1 + uplift/100) × time
  return leads * (conversionRate / 100) * dealValue * (1 + upliftPercent / 100) * timeMultiplier;
};

// Range calculator for Low/Realistic/High
export const calculateRanges = (
  leads: number,
  conversionRate: number,
  dealValue: number,
  upliftPercent: number,
  timeMultiplier: number
) => {
  const baseRevenue = leads * (conversionRate / 100) * dealValue * timeMultiplier;
  
  // Low: 70% of stated uplift (conservative estimate)
  const lowUplift = upliftPercent * 0.7;
  const lowRevenue = calculateProjection(leads, conversionRate, dealValue, lowUplift, timeMultiplier);
  
  // Realistic: stated uplift
  const realisticRevenue = calculateProjection(leads, conversionRate, dealValue, upliftPercent, timeMultiplier);
  
  // High: 130% of stated uplift (optimistic but capped)
  const highUplift = Math.min(upliftPercent * 1.3, 50); // Cap at 50% max
  const highRevenue = calculateProjection(leads, conversionRate, dealValue, highUplift, timeMultiplier);
  
  return {
    baseline: baseRevenue,
    low: { revenue: lowRevenue, uplift: lowUplift, delta: lowRevenue - baseRevenue },
    realistic: { revenue: realisticRevenue, uplift: upliftPercent, delta: realisticRevenue - baseRevenue },
    high: { revenue: highRevenue, uplift: highUplift, delta: highRevenue - baseRevenue },
  };
};

// Slider component
const VisualSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  icon: Icon,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ElementType;
  tooltip?: string;
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center gap-2 text-small font-medium text-text-primary">
          {Icon && <Icon className="w-4 h-4 text-text-muted" />}
          {label}
          {tooltip && (
            <span className="group relative">
              <HelpCircle className="w-3 h-3 text-text-muted cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-primary-foreground text-caption rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <div className="px-3 py-1 bg-surface-2 rounded-lg text-small font-semibold text-text-primary tabular-nums">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
      </div>
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
  );
};

// Animated counter
const AnimatedMetric = ({ value, prefix = '', enabled = true }: { value: number; prefix?: string; enabled?: boolean }) => {
  const { displayValue } = useAnimatedCounter(value, { duration: 600, enabled });
  return <span className="font-serif tabular-nums">{prefix}{displayValue}</span>;
};

// Range result bar
const RangeBar = ({ 
  label, 
  value, 
  maxValue, 
  color, 
  animationDelay,
  prefersReducedMotion,
}: { 
  label: string; 
  value: number; 
  maxValue: number; 
  color: 'low' | 'realistic' | 'high';
  animationDelay: number;
  prefersReducedMotion: boolean;
}) => {
  const width = Math.min((value / maxValue) * 100, 100);
  const colorClasses = {
    low: 'bg-text-muted',
    realistic: 'bg-charcoal',
    high: 'bg-green-600',
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between text-caption mb-1">
        <span className="text-text-muted capitalize">{label}</span>
        <span className="font-medium text-text-primary">{formatCurrency(value)}</span>
      </div>
      <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.8, 
            delay: prefersReducedMotion ? 0 : animationDelay,
            ease: [0.33, 1, 0.68, 1],
          }}
        />
      </div>
    </div>
  );
};

// Uplift preset pills
const UpliftPresets = ({
  selected,
  onSelect,
  caps,
}: {
  selected: UpliftLevel | null;
  onSelect: (level: UpliftLevel, value: number) => void;
  caps: { conservative: number; realistic: number; aggressive: number };
}) => (
  <div className="flex gap-2 mt-2">
    {(['conservative', 'realistic', 'aggressive'] as UpliftLevel[]).map((level) => (
      <button
        key={level}
        onClick={() => onSelect(level, caps[level])}
        className={`flex-1 py-2 px-2 rounded-lg text-caption font-medium transition-all ${
          selected === level 
            ? 'bg-charcoal text-primary-foreground' 
            : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
        }`}
      >
        <span className="block">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
        <span className="text-[10px] opacity-70">{caps[level]}%</span>
      </button>
    ))}
  </div>
);

// Assumptions panel
const AssumptionsPanel = ({
  isOpen,
  onToggle,
  inputs,
  ranges,
  timeHorizon,
}: {
  isOpen: boolean;
  onToggle: () => void;
  inputs: { leads: number; conversion: number; dealValue: number; uplift: number };
  ranges: ReturnType<typeof calculateRanges>;
  timeHorizon: TimeHorizon;
}) => (
  <div className="mt-4 border border-border rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 bg-surface-2/50 hover:bg-surface-2 transition-colors"
    >
      <span className="flex items-center gap-2 text-small font-medium text-text-primary">
        <Info className="w-4 h-4" />
        Assumptions & Formulas
      </span>
      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-3 text-caption">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-2 p-2 rounded-lg">
                <span className="text-text-muted">Leads/{timeHorizon}</span>
                <p className="font-medium text-text-primary">{inputs.leads}</p>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg">
                <span className="text-text-muted">Close Rate</span>
                <p className="font-medium text-text-primary">{inputs.conversion}%</p>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg">
                <span className="text-text-muted">Avg Deal</span>
                <p className="font-medium text-text-primary">${inputs.dealValue.toLocaleString()}</p>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg">
                <span className="text-text-muted">Uplift Applied</span>
                <p className="font-medium text-text-primary">{inputs.uplift}%</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-border">
              <p className="text-text-muted mb-2">Formula:</p>
              <code className="block bg-surface-3 p-2 rounded text-[11px] text-text-secondary">
                Revenue = Leads × (ConvRate/100) × DealValue × (1 + Uplift/100)
              </code>
            </div>
            
            <div className="pt-3 border-t border-border">
              <p className="text-text-muted mb-2">Range Calculations:</p>
              <ul className="space-y-1 text-text-secondary">
                <li>• <strong>Low:</strong> 70% of stated uplift = {(inputs.uplift * 0.7).toFixed(1)}%</li>
                <li>• <strong>Realistic:</strong> Stated uplift = {inputs.uplift}%</li>
                <li>• <strong>High:</strong> 130% of uplift (max 50%) = {Math.min(inputs.uplift * 1.3, 50).toFixed(1)}%</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export function AnimatedRoiCalculator() {
  const prefersReducedMotion = useReducedMotion();
  
  // Inputs
  const [industry, setIndustry] = useState<IndustryKey>('b2b');
  const [dealValue, setDealValue] = useState(12000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(40);
  const [conversionRate, setConversionRate] = useState(12);
  const [upliftPercent, setUpliftPercent] = useState(12);
  const [upliftLevel, setUpliftLevel] = useState<UpliftLevel | null>('realistic');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('monthly');
  
  // UI state
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [justification, setJustification] = useState('');
  
  const preset = INDUSTRY_PRESETS[industry];
  const timeMultiplier = timeHorizon === 'yearly' ? 12 : timeHorizon === 'quarterly' ? 3 : 1;
  
  // Check for unrealistic uplift
  const maxAllowedUplift = preset.upliftCaps.aggressive + 12; // 12% buffer
  const isUnrealistic = upliftPercent > maxAllowedUplift;
  
  // Calculate ranges
  const ranges = useMemo(() => 
    calculateRanges(leadsPerMonth, conversionRate, dealValue, upliftPercent, timeMultiplier),
    [leadsPerMonth, conversionRate, dealValue, upliftPercent, timeMultiplier]
  );
  
  const maxProjection = ranges.high.revenue * 1.2; // For bar chart scaling

  // Apply industry preset
  const applyPreset = useCallback((key: IndustryKey) => {
    const p = INDUSTRY_PRESETS[key];
    setIndustry(key);
    setDealValue(p.dealValue);
    setLeadsPerMonth(p.leads);
    setConversionRate(p.baseConversion);
    setUpliftPercent(p.upliftCaps.realistic);
    setUpliftLevel('realistic');
    trackEvent('roi_preset_selected', { preset: key });
  }, []);

  // Apply uplift preset
  const applyUpliftPreset = useCallback((level: UpliftLevel, value: number) => {
    setUpliftPercent(value);
    setUpliftLevel(level);
    setShowWarning(false);
  }, []);

  // Handle manual uplift change
  const handleUpliftChange = useCallback((value: number) => {
    setUpliftPercent(value);
    setUpliftLevel(null);
    if (value > maxAllowedUplift) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [maxAllowedUplift]);

  // Analytics
  const emitAnalytics = useCallback(() => {
    trackROICalculator(
      { dealValue, leadsPerMonth, conversionRate, upliftPercent },
      ranges.realistic.delta
    );
    trackEvent('roi_time_horizon', { horizon: timeHorizon });
  }, [dealValue, leadsPerMonth, conversionRate, upliftPercent, timeHorizon, ranges.realistic.delta]);

  const handleBookDemo = () => {
    if (isUnrealistic && !justification.trim()) {
      setShowWarning(true);
      return;
    }
    emitAnalytics();
    trackCTAClick('Book Demo with Projection', 'roi_calculator', '#contact');
    trackEvent('book_demo_click', { source: 'primary_cta' });
    
    sessionStorage.setItem('roiPrefill', JSON.stringify({
      source: 'roi_calculator',
      projection: ranges.realistic.revenue,
      range: { low: ranges.low.revenue, high: ranges.high.revenue },
      timeHorizon,
      industry,
    }));
    
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExportPDF = () => {
    if (isUnrealistic && !justification.trim()) {
      setShowWarning(true);
      return;
    }
    trackEvent('roi_exported', { format: 'pdf', industry, timeHorizon });
    alert(`PDF Export Ready!\n\nProjected Revenue (${timeHorizon}):\n• Low: ${formatCurrency(ranges.low.revenue)}\n• Realistic: ${formatCurrency(ranges.realistic.revenue)}\n• High: ${formatCurrency(ranges.high.revenue)}`);
  };

  const handleCopyProjection = () => {
    const text = `Pure Craft ROI Projection (${industry.toUpperCase()})\n\nInputs:\n• Leads/month: ${leadsPerMonth}\n• Close rate: ${conversionRate}%\n• Avg deal: $${dealValue.toLocaleString()}\n• Uplift: ${upliftPercent}%\n\nProjected ${timeHorizon} revenue:\n• Low: ${formatCurrency(ranges.low.revenue)}\n• Realistic: ${formatCurrency(ranges.realistic.revenue)}\n• High: ${formatCurrency(ranges.high.revenue)}`;
    navigator.clipboard.writeText(text);
    trackEvent('roi_copied', { timeHorizon, industry });
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
            Realistic ROI Model
          </h2>
          <p className="text-body text-text-secondary max-w-md mx-auto">
            Transparent projections with range estimates.
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
          <div className="bg-card rounded-2xl border border-border p-5 shadow-depth-1">
            <h3 className="font-serif text-lg text-text-primary mb-4">Your Numbers</h3>
            
            {/* Industry presets */}
            <div className="mb-5">
              <label className="text-small font-medium text-text-primary mb-2 block">Industry</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(INDUSTRY_PRESETS) as IndustryKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className={`px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
                      industry === key 
                        ? 'bg-charcoal text-primary-foreground' 
                        : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }`}
                  >
                    {INDUSTRY_PRESETS[key].name}
                  </button>
                ))}
              </div>
              <p className="text-caption text-text-muted mt-2">{preset.description}</p>
            </div>
            
            <VisualSlider
              label="Average Deal Value"
              value={dealValue}
              onChange={setDealValue}
              min={50}
              max={50000}
              step={50}
              prefix="$"
              icon={DollarSign}
            />

            <VisualSlider
              label="Leads per Month"
              value={leadsPerMonth}
              onChange={setLeadsPerMonth}
              min={5}
              max={1000}
              step={5}
              icon={Users}
            />

            <VisualSlider
              label="Current Close Rate"
              value={conversionRate}
              onChange={setConversionRate}
              min={1}
              max={40}
              suffix="%"
              icon={Percent}
              tooltip={`Industry baseline for ${preset.name}: ~${preset.baseConversion}%`}
            />

            <div className="mb-5">
              <VisualSlider
                label="Expected Improvement"
                value={upliftPercent}
                onChange={handleUpliftChange}
                min={2}
                max={50}
                suffix="%"
                icon={TrendingUp}
                tooltip="Realistic range depends on industry and current performance"
              />
              <UpliftPresets 
                selected={upliftLevel} 
                onSelect={applyUpliftPreset} 
                caps={preset.upliftCaps}
              />
            </div>

            {/* Warning for unrealistic inputs */}
            <AnimatePresence>
              {showWarning && isUnrealistic && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-small text-yellow-800 font-medium">
                        Uplift exceeds typical range for {preset.name}
                      </p>
                      <p className="text-caption text-yellow-700 mt-1">
                        Please add a brief justification to proceed.
                      </p>
                      <input
                        type="text"
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        placeholder="e.g., High-performing baseline, proven channel..."
                        className="mt-2 w-full px-3 py-2 text-small bg-white border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Time horizon */}
            <div>
              <label className="text-small font-medium text-text-primary mb-2 block">Time Horizon</label>
              <div className="flex gap-1 p-1 bg-surface-2 rounded-full">
                {(['monthly', 'quarterly', 'yearly'] as TimeHorizon[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setTimeHorizon(h)}
                    className={`flex-1 py-2 px-3 rounded-full text-caption font-medium transition-all ${
                      timeHorizon === h 
                        ? 'bg-card shadow-depth-1 text-text-primary' 
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {h.charAt(0).toUpperCase() + h.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Assumptions panel */}
            <AssumptionsPanel
              isOpen={showAssumptions}
              onToggle={() => setShowAssumptions(!showAssumptions)}
              inputs={{ leads: leadsPerMonth, conversion: conversionRate, dealValue, uplift: upliftPercent }}
              ranges={ranges}
              timeHorizon={timeHorizon}
            />
          </div>

          {/* Right: Results */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-depth-1">
            <h3 className="font-serif text-lg text-text-primary mb-4">
              Projected Revenue <span className="text-text-muted font-sans text-small">({timeHorizon})</span>
            </h3>
            
            {/* Range bars */}
            <div 
              className="mb-6"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <RangeBar 
                label="Low" 
                value={ranges.low.revenue} 
                maxValue={maxProjection} 
                color="low"
                animationDelay={0}
                prefersReducedMotion={prefersReducedMotion}
              />
              <RangeBar 
                label="Realistic" 
                value={ranges.realistic.revenue} 
                maxValue={maxProjection} 
                color="realistic"
                animationDelay={0.1}
                prefersReducedMotion={prefersReducedMotion}
              />
              <RangeBar 
                label="High" 
                value={ranges.high.revenue} 
                maxValue={maxProjection} 
                color="high"
                animationDelay={0.2}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Main metric */}
            <div className="text-center p-4 bg-surface-2/50 rounded-xl mb-4">
              <span className="text-caption text-text-muted block mb-1">Realistic Projection</span>
              <div className="text-3xl md:text-4xl text-text-primary">
                <AnimatedMetric 
                  value={ranges.realistic.revenue} 
                  prefix="$" 
                  enabled={!prefersReducedMotion} 
                />
              </div>
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-caption">
                <TrendingUp className="w-3 h-3" />
                +{formatCurrency(ranges.realistic.delta)} vs baseline
              </div>
            </div>

            {/* Charts */}
            <Suspense fallback={<ChartLoader />}>
              <LazyCharts 
                currentRevenue={ranges.baseline}
                projectedRevenue={ranges.realistic.revenue}
                upliftRatio={1 + upliftPercent / 100}
                prefersReducedMotion={prefersReducedMotion}
                showComparison={true}
              />
            </Suspense>

            {/* CTAs */}
            <div className="grid grid-cols-3 gap-2 mt-5">
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
                className="inline-flex items-center justify-center gap-1 px-3 py-3 border border-border text-text-primary rounded-full hover:bg-surface-2 transition-colors"
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
