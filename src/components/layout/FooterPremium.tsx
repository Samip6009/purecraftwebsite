/**
 * FooterPremium.tsx - Site footer with logo, navigation, and socials
 * Features: Multi-column layout, social links, newsletter hint
 */
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight, Mail } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from './SiteShell';
import { trackSocialClick } from '@/lib/analytics';

// Facebook icon
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const footerLinks = {
  services: [
    { name: 'Digital Marketing', href: '#services' },
    { name: 'AI Appointment Setting', href: '#services' },
    { name: 'Lead Generation', href: '#services' },
    { name: 'Social Media Marketing', href: '#services' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
    { name: 'Careers', href: '#careers' },
  ],
  resources: [
    { name: 'ROI Calculator', href: '#roi' },
    { name: 'Case Studies', href: '#portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '#faq' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/purecraft.media?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61576632570565',
    icon: FacebookIcon,
  },
];

export function FooterPremium() {
  const prefersReducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string) => {
    trackSocialClick(platform);
  };

  return (
    <footer className="relative bg-surface-2 border-t border-border overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23000' stroke-opacity='0.02' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      {/* Main Footer */}
      <Container size="wide" className="relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-3 mb-6">
              <img 
                src="/assets/pure-craft-logo.png" 
                alt="Pure Craft - Digital Marketing Agency Nepal" 
                className="h-10 w-auto"
                width={40}
                height={40}
                loading="lazy"
              />
              <span className="font-serif text-lg font-medium text-text-primary">
                Pure Craft
              </span>
            </a>
            
            {/* Nepal-focused SEO text */}
            <p className="text-small text-text-secondary mb-6 max-w-xs">
              Pure Craft is a digital marketing agency in Nepal helping businesses grow through performance marketing.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.name)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-charcoal-muted hover:bg-surface-3 transition-all duration-medium"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-4 h-4 text-text-secondary" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-serif text-base font-medium text-text-primary mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-small text-text-secondary hover:text-text-primary transition-colors duration-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-base font-medium text-text-primary mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-small text-text-secondary hover:text-text-primary transition-colors duration-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-serif text-base font-medium text-text-primary mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-small text-text-secondary hover:text-text-primary transition-colors duration-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact CTA */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-serif text-base font-medium text-text-primary mb-4">
              Get in Touch
            </h4>
            <p className="text-small text-text-secondary mb-4">
              Ready to grow? Let's talk about your goals.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-small font-medium rounded-full transition-all duration-medium hover:shadow-depth-2"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <Mail className="w-4 h-4" />
              Contact Us
              <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <Container size="wide" className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-small text-text-muted">
              © {currentYear} Pure Craft Digital Agency. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <a 
                href="/privacy" 
                className="text-small text-text-muted hover:text-text-secondary transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-small text-text-muted hover:text-text-secondary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default FooterPremium;
