/**
 * Pure Craft - Digital Marketing Agency
 * samipkc.com.np - Visual-first, conversion-optimized
 */
import { SiteShell } from '@/components/layout/SiteShell';
import { Header } from '@/components/layout/Header';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { BentoGridSection } from '@/components/sections/BentoGrid';
import { BentoPortfolio } from '@/components/sections/BentoPortfolio';
import { TwoColumnSection } from '@/components/sections/TwoColumn';
import { AnimatedRoiCalculator } from '@/components/sections/AnimatedRoiCalculator';
import { ContactFormPremium } from '@/components/sections/ContactFormPremium';
import { FooterPremium } from '@/components/layout/FooterPremium';
import { SEOHead } from '@/lib/seo';

const Index = () => {
  return (
    <SiteShell>
      <SEOHead 
        title="Digital Marketing & AI Automation | Pure Craft"
        description="Pure Craft delivers AI-powered marketing that books demos, closes deals, and scales revenue. Get a tailored strategy for your business."
      />
      <Header />
      
      <main id="main-content">
        <HeroVisual variant={0} />
        <BentoGridSection />
        <BentoPortfolio />
        <TwoColumnSection />
        <AnimatedRoiCalculator />
        <ContactFormPremium />
      </main>
      
      <FooterPremium />
    </SiteShell>
  );
};

export default Index;
