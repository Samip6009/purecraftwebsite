import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="contact" className="bg-primary text-primary-foreground">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - CTA */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <span className="text-caption uppercase tracking-wider text-primary-foreground/60 mb-4 block">
              Get Started
            </span>
            
            <h2 className="font-serif text-h2 text-primary-foreground mb-6 text-balance">
              Ready to transform your outreach?
            </h2>
            
            <p className="text-body-lg text-primary-foreground/80 mb-10 max-w-md">
              Book a free strategy call. We'll analyze your current process and show you exactly 
              how Pure Craft can fill your calendar with qualified appointments.
            </p>

            <motion.a
              href="mailto:hello@samipkc.com.np"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary font-medium rounded-full shadow-depth-2 hover:shadow-depth-3 transition-all duration-medium"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              Book Your Free Call
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-foreground/10 rounded-xl flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-small text-primary-foreground/60 mb-1">Email</p>
                  <a 
                    href="mailto:hello@samipkc.com.np" 
                    className="text-body-lg text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  >
                    hello@samipkc.com.np
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-foreground/10 rounded-xl flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-small text-primary-foreground/60 mb-1">Location</p>
                  <p className="text-body-lg text-primary-foreground">
                    Remote-first, Global reach
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary-foreground/10">
              <p className="text-small text-primary-foreground/60 mb-4">
                Typical response time: under 24 hours
              </p>
              <p className="text-caption text-primary-foreground/40">
                No spam, no aggressive follow-ups. Just honest conversation.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
