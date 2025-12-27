/**
 * ServicesVisual.tsx - What We Do with visuals, not text
 * Pure Craft SMMA - Visual workflow tiles
 * Each service = image + 3 word title + 1 line benefit
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Container, Section } from '@/components/layout/SiteShell';

// Services with visual focus and SEO-friendly alt texts
const services = [
  {
    id: 'paid-ads',
    title: 'Paid Ads',
    benefit: 'Meta & Google that convert',
    visual: '/assets/photos/service-ads.jpg',
    alt: 'Paid advertising campaign management for Nepal businesses - Meta and Google Ads',
    icon: '📱',
  },
  {
    id: 'funnels',
    title: 'Funnels',
    benefit: 'Landing pages that capture',
    visual: '/assets/photos/service-funnels.jpg',
    alt: 'High-converting landing page and sales funnel design',
    icon: '🎯',
  },
  {
    id: 'lead-management',
    title: 'Lead CRM',
    benefit: 'Automated follow-up',
    visual: '/assets/photos/service-crm.jpg',
    alt: 'Lead management CRM with automated follow-up for Nepal marketing',
    icon: '📊',
  },
  {
    id: 'appointment-booking',
    title: 'AI Booking',
    benefit: 'Calendar fills itself',
    visual: '/assets/photos/service-calendar.jpg',
    alt: 'AI-powered appointment booking and calendar automation system',
    icon: '📅',
  },
  {
    id: 'reporting',
    title: 'Reporting',
    benefit: 'Know what works',
    visual: '/assets/photos/service-reports.jpg',
    alt: 'Performance marketing analytics and reporting dashboard',
    icon: '📈',
  },
];

// Service tile component
const ServiceTile = ({ 
  service, 
  index, 
  reduced 
}: { 
  service: typeof services[0]; 
  index: number;
  reduced: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.1 }}
      whileHover={reduced ? {} : { y: -8, scale: 1.02 }}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-2 cursor-pointer"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={service.visual}
          alt={service.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/10" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Icon */}
        <span className="text-3xl">{service.icon}</span>

        {/* Text */}
        <div>
          <h3 className="font-serif text-xl text-primary-foreground mb-1">
            {service.title}
          </h3>
          <p className="text-small text-primary-foreground/70">
            {service.benefit}
          </p>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export function ServicesVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <Section id="services" className="relative bg-surface-2/30 overflow-hidden">
      {/* Background visual layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal lines pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20' stroke='%23000' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-2/20 to-transparent" />
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
            Performance Marketing for Nepal Businesses
          </h2>
          <p className="text-body text-text-secondary">
            Full-stack growth. No gaps.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, i) => (
            <ServiceTile 
              key={service.id} 
              service={service} 
              index={i} 
              reduced={prefersReducedMotion} 
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default ServicesVisual;
