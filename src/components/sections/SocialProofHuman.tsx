/**
 * SocialProofHuman.tsx - Human-focused social proof
 * Pure Craft SMMA - Photos of people, not text walls
 * Instagram-style cards with 1-line quotes
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Container, Section } from '@/components/layout/SiteShell';

// Human proof cards with SEO-friendly alt texts
const proofItems = [
  {
    id: 'proof-1',
    image: '/assets/photos/client-sarah.jpg',
    name: 'Sarah M.',
    role: 'Founder, TechFlow',
    quote: 'Finally, ads that actually work.',
    alt: 'Sarah M. - TechFlow founder, Pure Craft digital marketing client testimonial',
  },
  {
    id: 'proof-2',
    image: '/assets/photos/client-james.jpg',
    name: 'James K.',
    role: 'CEO, Wellness Co',
    quote: 'Our calendar is full every week.',
    alt: 'James K. - Wellness Co CEO, Pure Craft AI appointment setting success story',
  },
  {
    id: 'proof-3',
    image: '/assets/photos/client-maria.jpg',
    name: 'Maria L.',
    role: 'Director, GrowthHQ',
    quote: 'Best investment we made this year.',
    alt: 'Maria L. - GrowthHQ Director, Pure Craft Nepal marketing agency client',
  },
  {
    id: 'proof-4',
    image: '/assets/photos/team-meeting.jpg',
    name: 'Our Team',
    role: 'Strategy Session',
    quote: 'Real people. Real results.',
    alt: 'Pure Craft digital marketing team in Nepal during strategy planning session',
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
          alt={item.alt}
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
    <Section id="testimonials" className="relative bg-surface-2/30 overflow-hidden">
      {/* Background photo layer with blur */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/photos/team-meeting.jpg"
          alt="Pure Craft digital marketing team strategy session"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ opacity: 0.04 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-surface-2/95" />
        {/* Dot pattern */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000' fill-opacity='0.04'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <Container size="wide" className="relative z-10">
        {/* Header with SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-h2 text-text-primary mb-2">
            Why Businesses Choose Pure Craft
          </h2>
          <p className="text-body text-text-muted">Built for businesses in Nepal</p>
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
