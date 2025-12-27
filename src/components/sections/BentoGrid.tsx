import { motion } from 'framer-motion';
import { Bot, Calendar, MessageSquare, TrendingUp, Zap, Shield } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

function BentoCard({ icon, title, description, className = '', delay = 0 }: BentoCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.5, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.33, 1, 0.68, 1]
      }}
      whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
      className={`group relative p-6 md:p-8 bg-card rounded-2xl border border-border shadow-depth-1 hover:shadow-depth-3 transition-shadow duration-medium ${className}`}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-surface-2/0 to-surface-3/0 group-hover:from-surface-2/50 group-hover:to-surface-3/30 transition-all duration-medium" />
      
      <div className="relative">
        <div className="w-12 h-12 flex items-center justify-center bg-surface-2 rounded-xl mb-5 group-hover:bg-surface-3 transition-colors duration-medium">
          {icon}
        </div>
        
        <h3 className="font-serif text-xl md:text-2xl text-text-primary mb-3">
          {title}
        </h3>
        
        <p className="text-body text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

const features = [
  {
    icon: <Bot className="w-6 h-6 text-charcoal" />,
    title: 'Intelligent AI Agents',
    description: 'Our AI understands context, handles objections, and adapts its approach in real-time—just like your best sales rep.',
  },
  {
    icon: <Calendar className="w-6 h-6 text-charcoal" />,
    title: 'Seamless Scheduling',
    description: 'Direct calendar integration ensures appointments are booked instantly, with zero friction or back-and-forth.',
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-charcoal" />,
    title: 'Natural Conversations',
    description: 'No robotic scripts. Every conversation feels human, personalized, and perfectly tailored to your prospect.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-charcoal" />,
    title: 'Analytics & Insights',
    description: 'Deep performance analytics help you understand what works, optimize campaigns, and scale what converts.',
  },
  {
    icon: <Zap className="w-6 h-6 text-charcoal" />,
    title: '24/7 Availability',
    description: 'Your AI never sleeps. Capture leads and book appointments around the clock, across any timezone.',
  },
  {
    icon: <Shield className="w-6 h-6 text-charcoal" />,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with end-to-end encryption. Your data stays protected.',
  },
];

export function BentoGridSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="services" className="bg-surface-2/30">
      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-caption uppercase tracking-wider text-text-muted mb-4 block">
            Capabilities
          </span>
          <h2 className="font-serif text-h2 text-text-primary mb-4 text-balance">
            Everything you need to scale
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            A complete AI appointment-setting solution, crafted for businesses that demand excellence.
          </p>
        </motion.div>

        {/* Bento Grid - Asymmetric Layout */}
        <div className="bento-grid bento-3x3">
          {features.map((feature, index) => (
            <BentoCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
              className={index === 0 ? 'md:col-span-2' : ''}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
