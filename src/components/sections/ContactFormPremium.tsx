/**
 * ContactFormPremium.tsx - Contact form with webhook support
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackFormStart, trackFormSubmit } from '@/lib/analytics';

export function ContactFormPremium() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Webhook stub - replace with actual endpoint
    try {
      // await fetch('YOUR_WEBHOOK_URL', { method: 'POST', body: JSON.stringify(data) });
      console.log('Form data:', data);
      trackFormSubmit('contact', true);
      setIsSubmitted(true);
    } catch {
      trackFormSubmit('contact', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="contact" className="bg-primary text-primary-foreground">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <span className="text-caption uppercase tracking-wider text-primary-foreground/60 mb-4 block">
              Let's Connect
            </span>
            <h2 className="font-serif text-h2 text-primary-foreground mb-6">
              Ready to grow?
            </h2>
            <p className="text-body-lg text-primary-foreground/80 mb-8">
              Tell us about your goals. We'll create a custom strategy for your business.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-foreground/60" />
                <a href="mailto:hello@samipkc.com.np" className="text-primary-foreground hover:text-primary-foreground/80">
                  hello@samipkc.com.np
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">Kathmandu, Nepal</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="bg-primary-foreground/10 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">Thank you!</h3>
                <p className="text-primary-foreground/80">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={() => trackFormStart('contact')} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <textarea
                  name="message"
                  placeholder="Tell us about your goals..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 resize-none"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-foreground text-primary font-medium rounded-full disabled:opacity-50"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export default ContactFormPremium;
