/**
 * ServicesVisual.tsx - Visual service tiles with image backgrounds
 * Pure Craft SMMA - Premium visual treatment with lazy loading
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Container, Section } from '@/components/layout/SiteShell';
import { Megaphone, Layers, Database, Bot, LineChart } from 'lucide-react';

const services = [
  {
    id: 'paid-ads',
    title: 'Paid Ads',
    benefit: 'Meta & Google that convert',
    icon: Megaphone,
    gradient: 'from-blue-600 to-purple-700',
    bgImage: '/assets/photos/service-ads.jpg',
    bgColor: '#1e40af',
  },
  {
    id: 'funnels',
    title: 'Funnels',
    benefit: 'Landing pages that capture',
    icon: Layers,
    gradient: 'from-purple-600 to-pink-700',
    bgImage: '/assets/photos/service-funnels.jpg',
    bgColor: '#6b21a8',
  },
  {
    id: 'lead-management',
    title: 'Lead CRM',
    benefit: 'Automated follow-up',
    icon: Database,
    gradient: 'from-pink-600 to-red-700',
    bgImage: '/assets/photos/service-crm.jpg',
    bgColor: '#831843',
  },
  {
    id: 'appointment-booking',
    title: 'AI Booking',
    benefit: 'Calendar fills itself',
    icon: Bot,
    gradient: 'from-orange-600 to-yellow-700',
    bgImage: '/assets/photos/service-calendar.jpg',
    bgColor: '#9a3412',
  },
  {
    id: 'reporting',
    title: 'Reporting',
    benefit: 'Know what works',
    icon: LineChart,
    gradient: 'from-green-600 to-teal-700',
    bgImage: '/assets/photos/service-reports.jpg',
    bgColor: '#15803d',
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
  
  const appearProps = reduced ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.5, delay: index * 0.1 }
  };

  return (
    <motion.div
      {...appearProps}
      whileHover={reduced ? {} : { y: -8 }}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Background image with lazy loading - Brightened */}
      <img
        src={service.bgImage}
        alt={service.title}
        loading={index > 2 ? "lazy" : "eager"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover brightness-125"
        srcSet={`${service.bgImage} 1x, ${service.bgImage} 2x`}
      />
      
      {/* Gradient overlay with brand color - Reduced opacity for visibility */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-70 mix-blend-multiply`}
      />
      
      {/* Lighter overlay for text contrast */}
      <div className="absolute inset-0 bg-charcoal/15" />
      
      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Icon container */}
        <div 
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
        >
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>

        {/* Text */}
        <div>
          <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-tight">
            {service.title}
          </h3>
          <p className="text-small text-white/90 leading-snug">
            {service.benefit}
          </p>
        </div>
      </div>

      {/* Hover effect - subtle highlight */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
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
            Full-Stack Growth
          </h2>
          <p className="text-lg text-text-secondary">Everything you need. No gaps.</p>
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
