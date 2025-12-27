/**
 * BentoPortfolio.tsx - Portfolio grid with case study tiles
 * Features: Asymmetric bento layout, hover effects, slide-over integration
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';
import { vibeVariants, motionTokens } from '@/lib/vibeMotion';
import BentoTile from './BentoTile';
import CasePanel from './CasePanel';
import { trackCaseStudyView } from '@/lib/analytics';

// 5 Sample micro-cases with metric-first copy
export const microCases = [
  {
    id: 'case-1',
    metric: '+312%',
    metricLabel: 'Lead increase',
    title: 'E-commerce Scale-Up',
    client: 'Fashion Retail Brand',
    industry: 'E-commerce',
    description: 'Transformed a struggling DTC brand into a lead-generation machine through AI-powered appointment setting and targeted social campaigns.',
    results: [
      '312% increase in qualified leads',
      '67% reduction in cost per acquisition',
      '$2.4M attributed revenue in 6 months',
      '48-hour average response time to 4 hours',
    ],
    challenge: 'The brand was spending heavily on ads but struggling to convert traffic into sales calls with high-value customers.',
    solution: 'Implemented AI appointment setting integrated with their CRM, combined with retargeting campaigns on Instagram and Facebook.',
    timeline: '6 months',
    featured: true,
  },
  {
    id: 'case-2',
    metric: '47%',
    metricLabel: 'Conversion rate',
    title: 'B2B Lead Pipeline',
    client: 'SaaS Platform',
    industry: 'Technology',
    description: 'Built a predictable B2B pipeline for a scaling SaaS company using AI outreach and LinkedIn strategies.',
    results: [
      '47% email-to-meeting conversion rate',
      '215 qualified demos booked monthly',
      '$890K pipeline generated in Q1',
      '12% of demos converted to enterprise deals',
    ],
    challenge: 'Sales team was drowning in cold outreach with minimal results and no time for high-value activities.',
    solution: 'AI-powered outreach sequences with personalization at scale, freeing the sales team to focus on closing.',
    timeline: '4 months',
    featured: false,
  },
  {
    id: 'case-3',
    metric: '8.2x',
    metricLabel: 'ROAS',
    title: 'Paid Media Overhaul',
    client: 'Health & Wellness',
    industry: 'Healthcare',
    description: 'Restructured paid media strategy for a wellness brand, achieving exceptional return on ad spend.',
    results: [
      '8.2x return on ad spend',
      '156% increase in appointment bookings',
      '34% lower CPA than industry average',
      'Scaled from $10K to $85K monthly spend',
    ],
    challenge: 'Previous agency delivered inconsistent results with no clear attribution or optimization strategy.',
    solution: 'Full-funnel restructure with AI appointment setting for high-intent leads, clear attribution, and weekly optimization.',
    timeline: '5 months',
    featured: false,
  },
  {
    id: 'case-4',
    metric: '23K',
    metricLabel: 'New followers/month',
    title: 'Social Growth Engine',
    client: 'Personal Brand',
    industry: 'Coaching',
    description: 'Built a content and engagement system that turned a coach into a recognized industry authority.',
    results: [
      '23K new followers per month average',
      '340% increase in inbound inquiries',
      'Featured in 12 major publications',
      '$450K in course sales attributed to organic',
    ],
    challenge: 'Great expertise but zero online presence or system for converting attention into revenue.',
    solution: 'Content strategy, community management, and AI appointment setting for discovery calls.',
    timeline: '8 months',
    featured: false,
  },
  {
    id: 'case-5',
    metric: '92%',
    metricLabel: 'Time saved',
    title: 'Automation Suite',
    client: 'Real Estate Agency',
    industry: 'Real Estate',
    description: 'Implemented end-to-end automation for a busy real estate team, reclaiming hours every week.',
    results: [
      '92% reduction in manual scheduling tasks',
      '28 hours saved per agent per month',
      '3x increase in showing appointments',
      '18% higher client satisfaction scores',
    ],
    challenge: 'Agents spent more time on admin than selling, missing opportunities due to slow response times.',
    solution: 'AI appointment setting with instant response, automated follow-ups, and CRM integration.',
    timeline: '3 months',
    featured: false,
  },
];

export function BentoPortfolio() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCase, setSelectedCase] = useState<typeof microCases[0] | null>(null);

  const handleCaseClick = (caseItem: typeof microCases[0]) => {
    setSelectedCase(caseItem);
    trackCaseStudyView(caseItem.id, caseItem.title);
  };

  const containerVariants = prefersReducedMotion 
    ? vibeVariants.reducedMotion 
    : vibeVariants.staggerContainer;

  return (
    <>
      <Section id="portfolio" className="bg-background">
        <Container size="wide">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
            className="text-center mb-16"
          >
            <span className="text-caption uppercase tracking-wider text-text-muted mb-4 block">
              Results That Speak
            </span>
            <h2 className="font-serif text-h2 text-text-primary mb-4 text-balance">
              Client Success Stories
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Real metrics from real clients. Click any case to see the full breakdown.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {microCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.tileReveal}
                custom={index}
                className={caseItem.featured ? 'md:col-span-2 md:row-span-2' : ''}
              >
                <BentoTile
                  caseItem={caseItem}
                  featured={caseItem.featured}
                  onClick={() => handleCaseClick(caseItem)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={prefersReducedMotion ? vibeVariants.reducedMotion : vibeVariants.fadeUp}
            className="text-center mt-12"
          >
            <p className="text-body text-text-secondary mb-4">
              Want results like these?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-text-primary font-medium link-editorial"
            >
              Get your custom strategy
              <span className="text-lg">→</span>
            </a>
          </motion.div>
        </Container>
      </Section>

      {/* Case Panel Slide-over */}
      <CasePanel
        caseItem={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </>
  );
}

export default BentoPortfolio;
