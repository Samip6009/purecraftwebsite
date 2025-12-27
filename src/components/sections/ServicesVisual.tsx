/**
 * ServicesVisual.tsx - Visual service tiles
 * Pure Craft SMMA - Premium visual treatment
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Container, Section } from '@/components/layout/SiteShell';
import { Megaphone, Layers, Database, Bot, LineChart } from 'lucide-react';

const services = [
  {
    id: 'paid-ads',
    title: 'Paid Ads',
    benefit: 'Predictable Meta & Google acquisition',
    icon: Megaphone,
    gradient: 'from-blue-600 to-purple-700',
    image: '/assets/photos/service-ads.jpg',
  },
  {
    id: 'funnels',
    title: 'Funnels',
    benefit: 'Conversion-optimized funnels for call flow',
    icon: Layers,
    gradient: 'from-purple-600 to-pink-700',
    image: '/assets/photos/service-funnels.jpg',
  },
  {
    id: 'lead-management',
    title: 'Lead CRM',
    benefit: 'Automated follow-up and pipeline control',
    icon: Database,
    gradient: 'from-pink-600 to-red-700',
    image: '/assets/photos/service-crm.jpg',
  },
  {
    id: 'appointment-booking',
    title: 'AI Booking',
    benefit: 'Autonomous scheduling that fills calendars',
    icon: Bot,
    gradient: 'from-orange-600 to-yellow-700',
    image: '/assets/photos/service-calendar.jpg',
  },
  {
    id: 'reporting',
    title: 'Reporting',
    benefit: 'Decision-grade reporting and tracking',
    icon: LineChart,
    gradient: 'from-green-600 to-teal-700',
    image: '/assets/photos/service-reports.jpg',
  },
];

const ServiceTile = ({ 
  service, 
  index, 
  reduced 
}: { 
  service: typeof services[0]; 
  index: number;
  reduced: boolean;
}) => {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.1 }}
      whileHover={reduced ? {} : { y: -8, scale: 1.02 }}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
      aria-label={`${service.title} — ${service.benefit}`}
    >
      {/* Background image */}
      <img
        src={service.image}
        alt={`${service.title} – ${service.benefit} visual`}
        loading="lazy"
        decoding="async"
        width={1200}
        height={1200}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
      
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-30`} />
      
      {/* Animated shimmer */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Icon */}
        <motion.div 
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
          animate={reduced ? {} : { rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
        >
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
        </motion.div>

        {/* Text */}
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-primary-foreground mb-1">
            {service.title}
          </h2>
          <p className="text-small text-primary-foreground/80 group-hover:text-primary-foreground transition-colors duration-300">
            {service.benefit}
          </p>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 pointer-events-none" />
    </motion.article>
  );
};

export function ServicesVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <Section id="services" className="relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-2/50 to-background">
        {/* Diagonal pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <Container size="wide" className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary mb-3">
            Full-Stack Acquisition
          </h2>
          <p className="text-lg text-text-secondary">Integrated systems. No gaps.</p>
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
