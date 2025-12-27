/**
 * Pure Craft - Premium SMMA Agency
 * samipkc.com.np - Visual-first, 80/20 design
 */
import { SiteShell } from '@/components/layout/SiteShell';
import { Header } from '@/components/layout/Header';
import { HeroAgency } from '@/components/sections/HeroAgency';
import { VisualProof } from '@/components/sections/VisualProof';
import { ServicesVisual } from '@/components/sections/ServicesVisual';
import { GrowthDiagnostic } from '@/components/sections/GrowthDiagnostic';
import { ContactFormPremium } from '@/components/sections/ContactFormPremium';
import { FooterPremium } from '@/components/layout/FooterPremium';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { SEOHead } from '@/lib/seo';

const Index = () => {
  return (
    <SiteShell>
      <SEOHead 
        title="Digital Marketing Agency in Nepal"
        description="Pure Craft is Nepal's leading digital marketing agency. AI-powered marketing, appointment setting, and lead generation for growing businesses. Book a demo today."
      />
      <Header />
      
      <main id="main-content">
        {/* Hero: Full visual takeover */}
        <HeroAgency />
        
        {/* Results: Visual proof cards */}
        <VisualProof />
        
        {/* Services: Visual tiles */}
        <ServicesVisual />
        
        {/* Diagnostic: Visual funnel */}
        <GrowthDiagnostic />
        
        {/* Contact: Visual card form */}
        <ContactFormPremium />
      </main>
      
      <FooterPremium />
      
      {/* Mobile sticky CTA */}
      <MobileStickyCTA />
    </SiteShell>
  );
};

export default Index;
