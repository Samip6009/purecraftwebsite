/**
 * ContactFormPremium.tsx - Visual contact section
 * Pure Craft — Card-based, gradient background, mobile-first
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, Mail, MapPin, CheckCircle2, Phone, Calendar, User, Building, MessageCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container, Section } from '@/components/layout/SiteShell';
import { trackFormStart, trackFormSubmit, trackEvent } from '@/lib/analytics';

// Country codes for phone input
const COUNTRY_CODES = [
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
] as const;

const formatPhoneE164 = (countryCode: string, phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return `${countryCode}${digits}`;
};

const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

const formatPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  company: string;
  businessType: string;
  message: string;
}

// Phone input component
function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryChange,
  error,
}: {
  value: string;
  countryCode: string;
  onChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  error?: string;
}) {
  const [showCodes, setShowCodes] = useState(false);

  return (
    <div className="relative">
      <label className="flex items-center gap-2 text-small font-medium text-text-primary mb-2">
        <Phone className="w-4 h-4" />
        Phone Number *
      </label>
      <div className="flex">
        <button
          type="button"
          onClick={() => setShowCodes(!showCodes)}
          className="flex items-center gap-1 px-3 py-3 bg-surface-2 border border-border border-r-0 rounded-l-xl text-text-primary hover:bg-surface-3 transition-colors"
        >
          <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
          <span className="text-small">{countryCode}</span>
        </button>
        
        <input
          type="tel"
          name="phone"
          value={value}
          onChange={(e) => onChange(formatPhoneDisplay(e.target.value))}
          placeholder="XXX-XXX-XXXX"
          required
          className={`flex-1 px-4 py-3 bg-surface-2 border border-border rounded-r-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-charcoal/20 ${
            error ? 'border-red-400' : ''
          }`}
        />
      </div>

      <AnimatePresence>
        {showCodes && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-depth-3 z-10 overflow-hidden"
          >
            {COUNTRY_CODES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onCountryChange(country.code);
                  setShowCodes(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-surface-2 transition-colors text-left"
              >
                <span>{country.flag}</span>
                <span className="text-small">{country.country}</span>
                <span className="text-caption text-text-muted ml-auto">{country.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-caption text-red-500">{error}</p>}
    </div>
  );
}

export function ContactFormPremium() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+977',
    company: '',
    businessType: '',
    message: '',
  });

  // Check for prefill
  useEffect(() => {
    try {
      const prefillJson = sessionStorage.getItem('roiPrefill');
      if (prefillJson) {
        const prefill = JSON.parse(prefillJson);
        if (prefill.projection) {
          setFormData(prev => ({
            ...prev,
            message: `Projected revenue: $${prefill.projection?.toLocaleString()}. I'd like to learn more.`,
          }));
          trackEvent('contact_prefill', { source: 'roi_calculator' });
          sessionStorage.removeItem('roiPrefill');
        }
      }
    } catch { /* ignore */ }
  }, []);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;
    trackFormStart('contact');
    setIsLoading(true);
    
    // Let Netlify handle the form submission natively
    const form = e.currentTarget;
    
    try {
      // Submit to Netlify
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as any).toString()
      });
      
      trackFormSubmit('contact', true);
      setIsSubmitted(true);
    } catch {
      trackFormSubmit('contact', false);
      setErrors({ message: 'Failed to submit. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Full visual background */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light" />
        
        {/* Animated gradient orbs */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                top: '-20%',
                right: '-10%',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                bottom: '-10%',
                left: '-5%',
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight">
              Ready to grow?
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-10 max-w-md">
              Tell us your goals. We'll build the strategy.
            </p>
            
            <div className="space-y-4 mb-10">
              <a href="mailto:hello@samipkc.com.np" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail className="w-5 h-5" />
                hello@samipkc.com.np
              </a>
              <a href="tel:+9779810071283" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
                +977 981-007-1283
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/60">
                <MapPin className="w-5 h-5" />
                Kathmandu, Nepal
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+9779810071283"
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href="https://wa.me/9779810071283?text=Hi%20Pure%20Craft%2C%20I%27d%20like%20to%20book%20a%20demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 rounded-full text-primary-foreground hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            <div className="bg-background rounded-3xl shadow-depth-4 p-6 md:p-8">
              {isSubmitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-text-primary mb-2">Thank you!</h3>
                  <p className="text-text-secondary mb-6">We'll contact you within 24 hours.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="tel:+9779810071283"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-charcoal text-primary-foreground rounded-full"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border rounded-full text-text-primary hover:bg-surface-2"
                    >
                      Submit Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="form-name" value="contact" />
                  <p style={{ display: 'none' }}>
                    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                  </p>
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-small font-medium text-text-primary mb-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                      required
                      className={`w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-charcoal/20 ${
                        errors.name ? 'border-red-400' : ''
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-caption text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-small font-medium text-text-primary mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="john@company.com"
                      required
                      className={`w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-charcoal/20 ${
                        errors.email ? 'border-red-400' : ''
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-caption text-red-500">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <PhoneInput
                    value={formData.phone}
                    countryCode={formData.countryCode}
                    onChange={(v) => updateField('phone', v)}
                    onCountryChange={(v) => updateField('countryCode', v)}
                    error={errors.phone}
                  />

                  {/* Business Type */}
                  <div>
                    <label className="flex items-center gap-2 text-small font-medium text-text-primary mb-2">
                      <Building className="w-4 h-4" />
                      Business Type
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => updateField('businessType', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                    >
                      <option value="">Select type</option>
                      <option value="service">Service Business</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS / Tech</option>
                      <option value="agency">Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-charcoal text-primary-foreground font-semibold rounded-xl disabled:opacity-50"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  >
                    {isLoading ? 'Sending...' : 'Get Started'}
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export default ContactFormPremium;
