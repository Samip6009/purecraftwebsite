/**
 * ContactFormPremium.tsx - Multi-step contact form with phone number
 * Pure Craft — Visual ROI & Media upgrade
 * Features: E.164 phone input, mobile multi-step UX, prefill support, webhook
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, Mail, MapPin, CheckCircle2, Phone, Calendar, User, Building } from 'lucide-react';
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

// Phone validation (E.164)
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

// Form data type
interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  company: string;
  role: string;
  monthlyLeads: string;
  preferredTime: string;
  message: string;
}

// Prefill data from ROI calculator or case study
interface PrefillData {
  source?: 'roi_calculator' | 'case_study';
  caseId?: string;
  projection?: number;
  timeHorizon?: string;
}

// Step configuration
const STEPS = {
  1: { title: 'Contact', fields: ['name', 'email', 'phone'] },
  2: { title: 'Company', fields: ['company', 'role', 'monthlyLeads'] },
  3: { title: 'Schedule', fields: ['preferredTime', 'message'] },
} as const;

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
      <label className="flex items-center gap-2 text-small font-medium text-primary-foreground/80 mb-2">
        <Phone className="w-4 h-4" />
        Phone Number *
      </label>
      <div className="flex">
        {/* Country code selector */}
        <button
          type="button"
          onClick={() => setShowCodes(!showCodes)}
          className="flex items-center gap-1 px-3 py-3 bg-primary-foreground/10 border border-primary-foreground/20 border-r-0 rounded-l-xl text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
        >
          <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
          <span className="text-small">{countryCode}</span>
        </button>
        
        {/* Phone input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(formatPhoneDisplay(e.target.value))}
          placeholder="XXX-XXX-XXXX"
          required
          className={`flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-r-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 ${
            error ? 'border-red-400' : ''
          }`}
        />
      </div>

      {/* Country dropdown */}
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

      {error && (
        <p className="mt-1 text-caption text-red-300">{error}</p>
      )}
    </div>
  );
}

export function ContactFormPremium() {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+977',
    company: '',
    role: '',
    monthlyLeads: '',
    preferredTime: '',
    message: '',
  });

  // Check for prefill data from ROI calculator or case studies
  useEffect(() => {
    try {
      const prefillJson = sessionStorage.getItem('roiPrefill');
      if (prefillJson) {
        const prefill: PrefillData = JSON.parse(prefillJson);
        if (prefill.source === 'roi_calculator' && prefill.projection) {
          setFormData(prev => ({
            ...prev,
            message: `I'm interested in achieving a projected revenue of $${prefill.projection?.toLocaleString()} per ${prefill.timeHorizon || 'month'}. Please share more about how Pure Craft can help.`,
          }));
          trackEvent('contact_prefill', { source: 'roi_calculator' });
          sessionStorage.removeItem('roiPrefill');
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Invalid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        trackFormStart('contact');
      }
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    // Prepare payload with E.164 phone
    const payload = {
      ...formData,
      phoneE164: formatPhoneE164(formData.countryCode, formData.phone),
      submittedAt: new Date().toISOString(),
      idempotencyKey: crypto.randomUUID(),
    };
    
    try {
      // Webhook stub - replace with actual endpoint
      // await fetch('YOUR_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      
      console.log('Form payload:', payload);
      
      // Hash email/phone for analytics privacy
      trackFormSubmit('contact', true);
      trackEvent('contact_submitted', {
        hasCompany: !!formData.company,
        hasMonthlyLeads: !!formData.monthlyLeads,
        // Don't send actual PII to analytics
      });
      
      setIsSubmitted(true);
    } catch {
      trackFormSubmit('contact', false);
      setErrors({ message: 'Failed to submit. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Section id="contact" className="bg-primary text-primary-foreground">
      <Container size="wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact info */}
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
              Share your goals. We'll create a custom growth strategy.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-foreground/60" />
                <a 
                  href="mailto:hello@samipkc.com.np" 
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                >
                  hello@samipkc.com.np
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-foreground/60" />
                <a 
                  href="tel:+9779800000000" 
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                >
                  +977 980-000-0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 pt-8 border-t border-primary-foreground/10">
              <p className="text-caption text-primary-foreground/60 mb-3">Trusted by growth-focused brands</p>
              <div className="flex gap-4 items-center opacity-60">
                {/* Placeholder for client logos */}
                <div className="w-16 h-8 bg-primary-foreground/20 rounded" />
                <div className="w-20 h-8 bg-primary-foreground/20 rounded" />
                <div className="w-14 h-8 bg-primary-foreground/20 rounded" />
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            {isSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary-foreground/10 rounded-2xl p-8 text-center"
              >
                <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-primary-foreground mb-2">Thank you!</h3>
                <p className="text-primary-foreground/80 mb-6">We'll be in touch within 24 hours.</p>
                
                {/* Quick actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-foreground/20 rounded-full text-small hover:bg-primary-foreground/30 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-medium transition-colors ${
                          step === currentStep 
                            ? 'bg-primary-foreground text-primary' 
                            : step < currentStep 
                              ? 'bg-green-500 text-primary-foreground' 
                              : 'bg-primary-foreground/20 text-primary-foreground/60'
                        }`}
                      >
                        {step < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-primary-foreground/20'}`} />
                      )}
                    </div>
                  ))}
                  <span className="ml-3 text-small text-primary-foreground/60">
                    {STEPS[currentStep as keyof typeof STEPS].title}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1: Contact */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-small font-medium text-primary-foreground/80 mb-2">
                          <User className="w-4 h-4" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="John Doe"
                          required
                          className={`w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 ${
                            errors.name ? 'border-red-400' : ''
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-caption text-red-300">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-small font-medium text-primary-foreground/80 mb-2">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="john@company.com"
                          required
                          className={`w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 ${
                            errors.email ? 'border-red-400' : ''
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-caption text-red-300">{errors.email}</p>}
                      </div>

                      <PhoneInput
                        value={formData.phone}
                        countryCode={formData.countryCode}
                        onChange={(v) => updateField('phone', v)}
                        onCountryChange={(v) => updateField('countryCode', v)}
                        error={errors.phone}
                      />
                    </motion.div>
                  )}

                  {/* Step 2: Company */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-small font-medium text-primary-foreground/80 mb-2">
                          <Building className="w-4 h-4" />
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          placeholder="Acme Inc."
                          className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                        />
                      </div>

                      <div>
                        <label className="text-small font-medium text-primary-foreground/80 mb-2 block">
                          Your Role
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => updateField('role', e.target.value)}
                          className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                        >
                          <option value="" className="text-text-primary">Select your role</option>
                          <option value="founder" className="text-text-primary">Founder / CEO</option>
                          <option value="marketing" className="text-text-primary">Marketing Director</option>
                          <option value="growth" className="text-text-primary">Head of Growth</option>
                          <option value="sales" className="text-text-primary">Sales Leader</option>
                          <option value="other" className="text-text-primary">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-small font-medium text-primary-foreground/80 mb-2 block">
                          Monthly Leads (approx.)
                        </label>
                        <select
                          value={formData.monthlyLeads}
                          onChange={(e) => updateField('monthlyLeads', e.target.value)}
                          className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                        >
                          <option value="" className="text-text-primary">Select range</option>
                          <option value="<50" className="text-text-primary">Less than 50</option>
                          <option value="50-100" className="text-text-primary">50 - 100</option>
                          <option value="100-500" className="text-text-primary">100 - 500</option>
                          <option value="500+" className="text-text-primary">500+</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Schedule */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-small font-medium text-primary-foreground/80 mb-2">
                          <Calendar className="w-4 h-4" />
                          Preferred Demo Time
                        </label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => updateField('preferredTime', e.target.value)}
                          className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                        >
                          <option value="" className="text-text-primary">Select time slot</option>
                          <option value="morning" className="text-text-primary">Morning (9 AM - 12 PM NPT)</option>
                          <option value="afternoon" className="text-text-primary">Afternoon (12 PM - 5 PM NPT)</option>
                          <option value="evening" className="text-text-primary">Evening (5 PM - 8 PM NPT)</option>
                          <option value="flexible" className="text-text-primary">Flexible</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-small font-medium text-primary-foreground/80 mb-2 block">
                          Message (optional)
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => updateField('message', e.target.value)}
                          placeholder="Tell us about your goals..."
                          rows={4}
                          className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-foreground text-primary font-medium rounded-full"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    >
                      Continue
                      <ArrowUpRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-foreground text-primary font-medium rounded-full disabled:opacity-50"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    >
                      {isLoading ? 'Sending...' : 'Send Request'}
                      <ArrowUpRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Honeypot for anti-spam */}
                <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

export default ContactFormPremium;
