import { SiteShell } from '@/components/layout/SiteShell';
import { Navigation } from '@/components/layout/Navigation';
import { HeroPremium } from '@/components/sections/HeroPremium';
import { BentoGridSection } from '@/components/sections/BentoGrid';
import { TwoColumnSection } from '@/components/sections/TwoColumn';
import { ContactSection } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

/**
 * Pure Craft - AI Appointment Setting
 * samipkc.com.np
 * 
 * Premium, minimalist white theme with:
 * - Editorial typography (Playfair Display + Inter)
 * - Monochrome depth through layered shadows
 * - Glassmorphism for subtle elevation
 * - Framer Motion animations (respects reduced-motion)
 * - Bento grid showcase
 */
const Index = () => {
  return (
    <SiteShell>
      <Navigation />
      
      <main id="main-content">
        {/* Premium Hero with refined motion */}
        <HeroPremium 
          headlineVariant={0}
          subheadVariant={0}
        />
        
        <BentoGridSection />
        <TwoColumnSection />
        <ContactSection />
      </main>
      
      <Footer />
    </SiteShell>
  );
};

export default Index;
