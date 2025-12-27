/**
 * SocialProofHuman.tsx - Human-focused social proof
 * Pure Craft SMMA - Photos of people, not text walls
 * Instagram-style cards with 1-line quotes
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Container, Section } from '@/components/layout/SiteShell';

// Human proof cards
const proofItems = [
  {
    id: 'proof-1',
    image: '/assets/photos/client-sarah.jpg',
    name: 'Sarah M.',
    role: 'Founder, TechFlow',
    quote: 'Finally, ads that actually work.',
  },
  {
    id: 'proof-2',
    image: '/assets/photos/client-james.jpg',
    name: 'James K.',
    role: 'CEO, Wellness Co',
    quote: 'Our calendar is full every week.',
  },
  {
    id: 'proof-3',
    image: '/assets/photos/client-maria.jpg',
    name: 'Maria L.',
    role: 'Director, GrowthHQ',
    quote: 'Best investment we made this year.',
  },
  {
    id: 'proof-4',
    image: '/assets/photos/team-meeting.jpg',
    name: 'Our Team',
    role: 'Strategy Session',
    quote: 'Real people. Real results.',
  },
];

// Individual card
const ProofCard = ({ 
  item, 
  index, 
  reduced 
}: { 
  item: typeof proofItems[0]; 
  index: number;
  reduced: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.1 }}
      whileHover={reduced ? {} : { rotate: 0, scale: 1.03, y: -5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-depth-3 border border-border"
    >
      {/* Photo */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Quote overlay - Instagram style */}
      <div className="p-4">
        <p className="text-body text-text-primary font-medium mb-2">
          "{item.quote}"
        </p>
        <div className="flex items-center gap-2">
          <span className="text-small font-semibold text-text-primary">{item.name}</span>
          <span className="text-caption text-text-muted">• {item.role}</span>
        </div>
      </div>
    </motion.div>
  );
};

export function SocialProofHuman() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <Section id="testimonials" className="bg-surface-2/30 overflow-hidden">
      <Container size="wide">
        {/* Minimal header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-h2 text-text-primary">
            People we work with.
          </h2>
        </motion.div>

        {/* Instagram-style grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {proofItems.map((item, i) => (
            <ProofCard 
              key={item.id} 
              item={item} 
              index={i} 
              reduced={prefersReducedMotion}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default SocialProofHuman;
