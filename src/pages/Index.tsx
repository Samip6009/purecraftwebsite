/**
 * Pure Craft - Premium SMMA Agency
 * samipkc.com.np - 80% visual, 20% text
 * HARD RESET: Visual-first, conversion-focused
 */
import { SiteShell } from '@/components/layout/SiteShell';
import { Header } from '@/components/layout/Header';
import { HeroAgency } from '@/components/sections/HeroAgency';
import { VisualProof } from '@/components/sections/VisualProof';
import { ServicesVisual } from '@/components/sections/ServicesVisual';
import { GrowthDiagnostic } from '@/components/sections/GrowthDiagnostic';
import { SocialProofHuman } from '@/components/sections/SocialProofHuman';
import { ContactFormPremium } from '@/components/sections/ContactFormPremium';
import { FooterPremium } from '@/components/layout/FooterPremium';
import { SEOHead } from '@/lib/seo';

const Index = () => {
  return (
    <SiteShell>
      <SEOHead 
        title="Pure Craft | Performance Marketing Agency"
        description="We turn ads into sales. Performance marketing with real leads, real results. Book a demo today."
      />
      <Header />
      
      <main id="main-content">
        {/* Hero: Visual montage + minimal copy */}
        <HeroAgency />
        
        {/* Results: Photo/video cards with metrics */}
        <VisualProof />
        
        {/* Services: Visual workflow tiles */}
        <ServicesVisual />
        
        {/* Diagnostic: Visual funnel, not calculator */}
        <GrowthDiagnostic />
        
        {/* Social Proof: Human photos, 1-line quotes */}
        <SocialProofHuman />
        
        {/* Contact: Phone-first, multi-step */}
        <ContactFormPremium />
      </main>
      
      <FooterPremium />
    </SiteShell>
  );
};

export default Index;
