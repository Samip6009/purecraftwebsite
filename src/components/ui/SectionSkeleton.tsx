/**
 * SectionSkeleton.tsx - Loading skeleton placeholders for lazy sections
 * Maintains layout during load without jank
 */
import { motion } from 'framer-motion';
import { Section, Container } from '@/components/layout/SiteShell';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

function SkeletonPulse({ className = '', animate = true }: SkeletonProps) {
  return (
    <div 
      className={`bg-surface-2 rounded-xl ${className}`}
      style={animate ? {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      } : undefined}
    />
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <SkeletonPulse className="h-16 w-3/4" />
            <SkeletonPulse className="h-12 w-1/2 opacity-60" />
            <SkeletonPulse className="h-6 w-2/3 opacity-40" />
            <div className="flex gap-4 pt-4">
              <SkeletonPulse className="h-14 w-40 rounded-full" />
            </div>
          </div>
          <div className="relative h-[400px]">
            <SkeletonPulse className="absolute top-0 left-0 w-32 h-24 rounded-2xl" />
            <SkeletonPulse className="absolute top-24 right-0 w-32 h-24 rounded-2xl" />
            <SkeletonPulse className="absolute inset-x-8 top-20 bottom-20 rounded-3xl opacity-50" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ProofSkeleton() {
  return (
    <Section className="bg-charcoal">
      <Container size="wide">
        <div className="text-center mb-12">
          <SkeletonPulse className="h-12 w-64 mx-auto mb-4" />
          <SkeletonPulse className="h-6 w-48 mx-auto opacity-60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonPulse key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ServicesSkeleton() {
  return (
    <Section className="bg-background">
      <Container size="wide">
        <div className="text-center mb-12">
          <SkeletonPulse className="h-12 w-48 mx-auto mb-4" />
          <SkeletonPulse className="h-6 w-64 mx-auto opacity-60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonPulse key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function DiagnosticSkeleton() {
  return (
    <Section className="bg-surface-2">
      <Container size="narrow">
        <div className="text-center mb-10">
          <SkeletonPulse className="h-12 w-56 mx-auto mb-4" />
          <SkeletonPulse className="h-6 w-72 mx-auto opacity-60" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <SkeletonPulse className="h-[300px] rounded-2xl" />
          <SkeletonPulse className="h-[300px] rounded-2xl" />
        </div>
      </Container>
    </Section>
  );
}

export function ContactSkeleton() {
  return (
    <Section className="bg-charcoal">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <SkeletonPulse className="h-16 w-64" />
            <SkeletonPulse className="h-6 w-48 opacity-60" />
            <div className="space-y-3 pt-4">
              <SkeletonPulse className="h-6 w-56" />
              <SkeletonPulse className="h-6 w-48" />
              <SkeletonPulse className="h-6 w-40" />
            </div>
          </div>
          <SkeletonPulse className="h-[400px] rounded-3xl bg-surface-2" />
        </div>
      </Container>
    </Section>
  );
}

export default {
  HeroSkeleton,
  ProofSkeleton,
  ServicesSkeleton,
  DiagnosticSkeleton,
  ContactSkeleton,
};
