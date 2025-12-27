/**
 * Pure Craft - Premium SMMA Agency
 * Performance optimized with lazy loading and deferred hydration
 */
import { lazy, Suspense, useEffect, memo } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';
import { Header } from '@/components/layout/Header';
import { HeroAgency } from '@/components/sections/HeroAgency';
import { FooterPremium } from '@/components/layout/FooterPremium';
import { SEOHead } from '@/lib/seo';
import { initAnalytics, initScrollTracking } from '@/lib/analytics';
import { 
  ProofSkeleton, 
  ServicesSkeleton, 
  DiagnosticSkeleton, 
  ContactSkeleton 
} from '@/components/ui/SectionSkeleton';

// Lazy load below-the-fold sections
const VisualProof = lazy(() => import('@/components/sections/VisualProof'));
const ServicesVisual = lazy(() => import('@/components/sections/ServicesVisual'));
const GrowthDiagnostic = lazy(() => import('@/components/sections/GrowthDiagnostic'));
const ContactFormPremium = lazy(() => import('@/components/sections/ContactFormPremium'));
const MobileStickyCTA = lazy(() => import('@/components/ui/MobileStickyCTA'));

// Memoize sections for performance
const MemoVisualProof = memo(VisualProof);
const MemoServicesVisual = memo(ServicesVisual);
const MemoGrowthDiagnostic = memo(GrowthDiagnostic);
const MemoContactFormPremium = memo(ContactFormPremium);
const MemoMobileStickyCTA = memo(MobileStickyCTA);

const Index = () => {
  // Deferred analytics initialization
  useEffect(() => {
    // Initialize analytics after first interaction or idle
    initAnalytics();
    const scrollCleanup = initScrollTracking();
    
    return () => {
      if (scrollCleanup) scrollCleanup();
    };
  }, []);

  return (
    <SiteShell>
      <SEOHead 
        title="Digital Marketing Agency in Nepal"
        description="Pure Craft is Nepal's leading digital marketing agency. AI-powered marketing, appointment setting, and lead generation for growing businesses. Book a demo today."
      />
      <Header />
      
      <main id="main-content">
        {/* Hero: Critical - loads immediately */}
        <HeroAgency />
        
        {/* Lazy loaded sections with skeletons */}
        <Suspense fallback={<ProofSkeleton />}>
          <MemoVisualProof />
        </Suspense>
        
        <Suspense fallback={<ServicesSkeleton />}>
          <MemoServicesVisual />
        </Suspense>
        
        <Suspense fallback={<DiagnosticSkeleton />}>
          <MemoGrowthDiagnostic />
        </Suspense>
        
        <Suspense fallback={<ContactSkeleton />}>
          <MemoContactFormPremium />
        </Suspense>
      </main>
      
      <FooterPremium />
      
      {/* Mobile sticky CTA - lazy loaded */}
      <Suspense fallback={null}>
        <MemoMobileStickyCTA />
      </Suspense>
    </SiteShell>
  );
};

export default Index;
