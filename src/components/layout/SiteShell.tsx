import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SiteShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * SiteShell - Global layout wrapper
 * Provides consistent spacing, max-width containers, and vertical rhythm
 * Accessibility: Maintains proper heading hierarchy and focus management
 */
export function SiteShell({ children, className = '' }: SiteShellProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>
      
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
  size?: 'narrow' | 'content' | 'wide' | 'full';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
}

/**
 * Container - Responsive width container with consistent padding
 */
export function Container({ 
  children, 
  size = 'content', 
  className = '',
  as: Component = 'div'
}: ContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-narrow',
    content: 'max-w-content',
    wide: 'max-w-wide',
    full: 'max-w-full-bleed',
  };

  return (
    <Component className={`mx-auto px-6 md:px-8 lg:px-12 ${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
}

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

/**
 * Section - Vertical rhythm section wrapper
 */
export function Section({ 
  children, 
  spacing = 'md', 
  className = '',
  id
}: SectionProps) {
  const spacingClasses = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24 lg:py-32',
    lg: 'py-24 md:py-32 lg:py-40',
  };

  return (
    <section id={id} className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}
