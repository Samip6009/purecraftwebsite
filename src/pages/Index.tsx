/**
 * Pure Craft - Digital Marketing Agency
 * samipkc.com.np
 */
import { SiteShell } from '@/components/layout/SiteShell';
import { Header } from '@/components/layout/Header';
import { HeroPremium } from '@/components/sections/HeroPremium';
import { BentoGridSection } from '@/components/sections/BentoGrid';
import { BentoPortfolio } from '@/components/sections/BentoPortfolio';
import { TwoColumnSection } from '@/components/sections/TwoColumn';
import { RoiCalculator } from '@/components/sections/RoiCalculator';
import { ContactFormPremium } from '@/components/sections/ContactFormPremium';
import { FooterPremium } from '@/components/layout/FooterPremium';
import { SEOHead } from '@/lib/seo';

const Index = () => {
  return (
    <SiteShell>
      <SEOHead 
        title="Digital Marketing & AI Automation"
        description="Pure Craft is a premium digital marketing agency specializing in AI-powered appointment setting and lead generation for enterprises."
      />
      <Header />
      
      <main id="main-content">
        <HeroPremium headlineVariant={0} subheadVariant={0} />
        <BentoGridSection />
        <BentoPortfolio />
        <TwoColumnSection />
        <RoiCalculator />
        <ContactFormPremium />
      </main>
      
      <FooterPremium />
    </SiteShell>
  );
};

export default Index;
