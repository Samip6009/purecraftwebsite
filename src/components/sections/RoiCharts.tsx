/**
 * RoiCharts.tsx - Chart components for ROI calculator
 * Lazy-loaded for performance, uses recharts
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface RoiChartsProps {
  currentRevenue: number;
  projectedRevenue: number;
  upliftRatio: number;
  prefersReducedMotion: boolean;
  showComparison?: boolean;
}

export function RoiCharts({
  currentRevenue,
  projectedRevenue,
  upliftRatio,
  prefersReducedMotion,
}: RoiChartsProps) {
  // Bar chart data
  const barData = useMemo(() => [
    { name: 'Current', value: currentRevenue, fill: 'hsl(var(--charcoal-muted))' },
    { name: 'Projected', value: projectedRevenue, fill: 'hsl(var(--charcoal))' },
  ], [currentRevenue, projectedRevenue]);

  // Donut data for uplift percentage (capped at 100%)
  const donutPercent = Math.min(((upliftRatio - 1) / upliftRatio) * 100, 100);
  const donutData = useMemo(() => [
    { name: 'Uplift', value: donutPercent },
    { name: 'Base', value: 100 - donutPercent },
  ], [donutPercent]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Bar Chart - Before/After */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.1 }}
        className="h-[140px]"
      >
        <p className="text-caption text-text-muted text-center mb-2">Revenue Comparison</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" barCategoryGap="30%">
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }}
              width={60}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              animationDuration={prefersReducedMotion ? 0 : 800}
            >
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Donut Chart - Uplift % */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.2 }}
        className="h-[140px] flex flex-col items-center justify-center"
      >
        <p className="text-caption text-text-muted text-center mb-2">Growth Rate</p>
        <div className="relative w-[100px] h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={45}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationDuration={prefersReducedMotion ? 0 : 1000}
              >
                <Cell fill="hsl(var(--charcoal))" />
                <Cell fill="hsl(var(--surface-3))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-serif font-medium text-text-primary">
              {upliftRatio.toFixed(1)}x
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RoiCharts;
