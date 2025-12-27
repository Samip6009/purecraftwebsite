/**
 * AnimatedRoiCalculator.tsx - Visual-first ROI calculator
 * Features: Donut chart, bar comparison, animated counters, confetti burst
 * Lazy-loads recharts, respects reduced motion
 */
import { useState, useMemo, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Container, Section } from '@/components/layout/SiteShell';
import { vibeVariants } from '@/lib/vibeMotion';
import { trackROICalculator, trackCTAClick } from '@/lib/analytics';

// Lazy load recharts for performance
const LazyCharts = lazy(() => import('./RoiCharts'));

// Fallback loader for charts
const ChartLoader = () => (
  <div className="h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-charcoal-muted border-t-transparent rounded-full animate-spin" />
  </div>
);

// Slider with live value bubble
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
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-small font-medium text-text-primary">
          {label}
        </label>
        <div className="px-3 py-1.5 bg-surface-2 rounded-lg text-small font-medium text-text-primary">
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
          className="w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-charcoal 
            [&::-webkit-slider-thumb]:shadow-depth-2
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            background: `linear-gradient(to right, hsl(var(--charcoal)) 0%, hsl(var(--charcoal)) ${percent}%, hsl(var(--surface-3)) ${percent}%, hsl(var(--surface-3)) 100%)`,
          }}
        />
      </div>
    </div>
  );
};

// Animated counter display
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
    duration: 800, 
    enabled,
  });

  return (
    <span className={`font-serif tabular-nums ${
      size === 'large' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'
    }`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

// Delta badge with optional confetti
const DeltaBadge = ({ 
  value, 
  percent,
  showConfetti,
}: { 
  value: number;
  percent: number;
  showConfetti: boolean;
}) => {
  return (
    <motion.div 
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-charcoal/10 rounded-full"
      animate={showConfetti ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <span className="text-small font-medium text-charcoal">
        +${value.toLocaleString()}
      </span>
      <span className="text-caption text-charcoal-muted">
        (+{percent.toFixed(0)}%)
      </span>
      
      {/* Confetti burst for big jumps */}
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

export function AnimatedRoiCalculator() {
  const prefersReducedMotion = useReducedMotion();
  
  // Input state
  const [dealValue, setDealValue] = useState(5000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(100);
  const [conversionRate, setConversionRate] = useState(10);
  const [upliftPercent, setUpliftPercent] = useState(150);
  
  // Scenario comparison
  const [scenario, setScenario] = useState<'current' | 'projected'>('projected');
  
  // Previous values for delta detection
  const [prevProjected, setPrevProjected] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const currentRevenue = leadsPerMonth * (conversionRate / 100) * dealValue;
    const projectedLeads = leadsPerMonth * 3; // 3x more leads
    const projectedConversion = conversionRate * (1 + upliftPercent / 100);
    const projectedRevenue = projectedLeads * (projectedConversion / 100) * dealValue;
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
  }, [dealValue, leadsPerMonth, conversionRate, upliftPercent]);

  // Confetti trigger on big jumps (>10% change)
  const handleValueChange = useCallback((newProjected: number) => {
    const change = Math.abs(newProjected - prevProjected) / Math.max(prevProjected, 1);
    if (change > 0.1 && prevProjected > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    setPrevProjected(newProjected);
  }, [prevProjected]);

  // Track changes
  useMemo(() => {
    handleValueChange(calculations.projectedRevenue);
  }, [calculations.projectedRevenue, handleValueChange]);

  // Analytics
  const handleCalculatorInteraction = useCallback(() => {
    trackROICalculator(
      { dealValue, leadsPerMonth, conversionRate, upliftPercent },
      calculations.additionalRevenue
    );
  }, [dealValue, leadsPerMonth, conversionRate, upliftPercent, calculations.additionalRevenue]);

  const handleBookDemo = () => {
    handleCalculatorInteraction();
    trackCTAClick('Book Demo with Projection', 'roi_calculator', '#contact');
    
    // Navigate and prefill (could use URL params or context)
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportPDF = () => {
    trackCTAClick('Export PDF', 'roi_calculator', 'pdf');
    // PDF export stub
    console.log('Export PDF with:', calculations);
  };

  return (
    <Section id="roi" className="bg-surface-2/30">
      <Container size="wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
          className="text-center mb-12"
        >
          <span className="text-caption uppercase tracking-wider text-text-muted mb-4 block">
            Revenue Projection
          </span>
          <h2 className="font-serif text-h2 text-text-primary mb-4">
            See Your Growth
          </h2>
          <p className="text-body-lg text-text-secondary max-w-lg mx-auto">
            Adjust the sliders and watch your potential revenue transform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Left: Inputs */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-depth-1">
            <h3 className="font-serif text-xl text-text-primary mb-6">Your Numbers</h3>
            
            <VisualSlider
              label="Average Deal Value"
              value={dealValue}
              onChange={(v) => { setDealValue(v); handleCalculatorInteraction(); }}
              min={500}
              max={50000}
              step={500}
              prefix="$"
            />

            <VisualSlider
              label="Leads per Month"
              value={leadsPerMonth}
              onChange={(v) => { setLeadsPerMonth(v); handleCalculatorInteraction(); }}
              min={10}
              max={500}
              step={10}
            />

            <VisualSlider
              label="Current Close Rate"
              value={conversionRate}
              onChange={(v) => { setConversionRate(v); handleCalculatorInteraction(); }}
              min={1}
              max={50}
              suffix="%"
            />

            <VisualSlider
              label="Expected Improvement"
              value={upliftPercent}
              onChange={(v) => { setUpliftPercent(v); handleCalculatorInteraction(); }}
              min={50}
              max={300}
              suffix="%"
            />

            {/* Scenario toggle */}
            <div className="flex gap-2 mt-6 p-1 bg-surface-2 rounded-full">
              {(['current', 'projected'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`flex-1 py-2 px-4 rounded-full text-small font-medium transition-all ${
                    scenario === s 
                      ? 'bg-card shadow-depth-1 text-text-primary' 
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {s === 'current' ? 'Current' : 'With Pure Craft'}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Visual Results */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-depth-1">
            {/* Main metric */}
            <div className="text-center mb-8">
              <span className="text-caption text-text-muted uppercase tracking-wider block mb-2">
                {scenario === 'current' ? 'Current Monthly Revenue' : 'Projected Monthly Revenue'}
              </span>
              <div 
                className="text-text-primary"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <AnimatedMetric 
                  value={scenario === 'current' ? calculations.currentRevenue : calculations.projectedRevenue}
                  prefix="$"
                  size="large"
                  enabled={!prefersReducedMotion}
                />
              </div>
              
              {scenario === 'projected' && (
                <div className="mt-4">
                  <DeltaBadge 
                    value={calculations.additionalRevenue} 
                    percent={calculations.percentIncrease}
                    showConfetti={showConfetti}
                  />
                </div>
              )}
            </div>

            {/* Charts */}
            <Suspense fallback={<ChartLoader />}>
              <LazyCharts 
                currentRevenue={calculations.currentRevenue}
                projectedRevenue={calculations.projectedRevenue}
                upliftRatio={calculations.upliftRatio}
                prefersReducedMotion={prefersReducedMotion}
              />
            </Suspense>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <motion.button
                onClick={handleBookDemo}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-full shadow-depth-2"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                Book Demo
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-border text-text-primary font-medium rounded-full hover:bg-surface-2 transition-colors"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default AnimatedRoiCalculator;
