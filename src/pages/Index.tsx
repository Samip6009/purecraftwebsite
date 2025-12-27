import { SiteShell } from '@/components/layout/SiteShell';
import { Navigation } from '@/components/layout/Navigation';
import { Hero } from '@/components/sections/Hero';
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
      {/* SEO Meta - Would typically be in Helmet or Next.js Head */}
      <title>Pure Craft — AI Appointment Setting | samipkc.com.np</title>
      
      <Navigation />
      
      <main id="main-content">
        <Hero />
        <BentoGridSection />
        <TwoColumnSection />
        <ContactSection />
      </main>
      
      <Footer />
    </SiteShell>
  );
};

export default Index;
