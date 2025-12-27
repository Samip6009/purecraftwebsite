/**
 * VisualProof.tsx - Results shown visually, not text
 * Pure Craft SMMA - 80% visual proof cards
 * No paragraphs. Just visuals + metrics.
 */
import { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackEvent } from '@/lib/analytics';

// Visual proof cards with minimal text and SEO-friendly alt texts
const proofCards = [
  {
    id: 'proof-1',
    metric: '8.2x',
    label: 'ROAS',
    visual: '/assets/photos/proof-dashboard.jpg',
    video: '/assets/videos/proof-dashboard.mp4',
    caption: 'Ad performance dashboard',
    alt: 'Digital marketing dashboard showing 8.2x ROAS for Nepal business campaign',
    color: 'bg-green-100',
  },
  {
    id: 'proof-2',
    metric: '47%',
    label: 'Close rate',
    visual: '/assets/photos/proof-calls.jpg',
    video: null,
    caption: 'Sales calls booked',
    alt: 'Pure Craft marketing agency sales call booking system',
    color: 'bg-blue-100',
  },
  {
    id: 'proof-3',
    metric: '312',
    label: 'Leads/month',
    visual: '/assets/photos/proof-leads.jpg',
    video: '/assets/videos/proof-leads.mp4',
    caption: 'CRM inbox filling',
    alt: 'Lead generation CRM showing monthly leads for Nepal digital marketing client',
    color: 'bg-purple-100',
  },
  {
    id: 'proof-4',
    metric: '23',
    label: 'Demos/week',
    visual: '/assets/photos/proof-calendar.jpg',
    video: null,
    caption: 'Calendar automation',
    alt: 'AI appointment setting calendar with automated bookings',
    color: 'bg-orange-100',
  },
  {
    id: 'proof-5',
    metric: '$2.4M',
    label: 'Revenue driven',
    visual: '/assets/photos/proof-revenue.jpg',
    video: null,
    caption: 'Client success',
    alt: 'Revenue growth chart from Pure Craft digital marketing campaigns',
    color: 'bg-emerald-100',
  },
];

// Individual proof card with hover video preview
const ProofCard = ({ 
  card, 
  index, 
  reduced 
}: { 
  card: typeof proofCards[0]; 
  index: number;
  reduced: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && card.video) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-2 cursor-pointer"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={card.visual}
          alt={card.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Video overlay on hover */}
        {card.video && (
          <video
            ref={videoRef}
            src={card.video}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Metric badge */}
        <div className={`inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full ${card.color} mb-3`}>
          <span className="text-caption font-semibold text-charcoal">{card.label}</span>
        </div>

        {/* Big metric */}
        <h3 className="font-serif text-4xl text-primary-foreground mb-1">
          {card.metric}
        </h3>

        {/* Tiny caption */}
        <p className="text-caption text-primary-foreground/70">
          {card.caption}
        </p>
      </div>

      {/* Play indicator for video cards */}
      {card.video && (
        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/80 flex items-center justify-center transition-transform ${
          isHovered ? 'scale-0' : 'scale-100'
        }`}>
          <Play className="w-4 h-4 text-charcoal ml-0.5" />
        </div>
      )}

      {/* Hover arrow */}
      <motion.div
        className="absolute top-4 right-4"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
      >
        <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5 text-charcoal" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export function VisualProof() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <Section id="results" className="relative bg-background overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23000' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <Container size="wide" className="relative z-10">
        {/* Minimal header with SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-h2 text-text-primary mb-2">
            Results-Driven Digital Marketing in Nepal
          </h2>
          <p className="text-body text-text-muted">Performance you can see</p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {proofCards.map((card, i) => (
              <ProofCard key={card.id} card={card} index={i} reduced={prefersReducedMotion} />
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {proofCards.map((card, i) => (
              <div key={card.id} className="flex-none w-[70vw] snap-start">
                <ProofCard card={card} index={i} reduced={prefersReducedMotion} />
              </div>
            ))}
          </div>
        </div>

        {/* Simple CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 text-text-primary font-medium hover:text-charcoal transition-colors"
            onClick={() => trackEvent('cta_click', { cta: 'get_results', location: 'visual_proof' })}
          >
            Get results like these
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}

export default VisualProof;
