/**
 * Analytics Stubs - Placeholder for GA4, Meta Pixel, etc.
 * Wire these up with actual tracking IDs in production
 */

// Event names for consistent tracking
export const ANALYTICS_EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  
  // Conversions
  CTA_CLICK: 'cta_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  
  // Engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  CASE_STUDY_VIEW: 'case_study_view',
  ROI_CALCULATOR_USE: 'roi_calculator_use',
  
  // Social
  SOCIAL_CLICK: 'social_click',
  SHARE: 'share',
} as const;

// Track event - stub for GA4 gtag
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  // Check if gtag exists (GA4)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, params);
  }
  
  // Dev logging
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, params);
  }
}

// Track page view
export function trackPageView(path: string, title?: string) {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page_path: path,
    page_title: title || document.title,
  });
}

// Track CTA clicks
export function trackCTAClick(
  ctaName: string,
  location: string,
  destination?: string
) {
  trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
    cta_name: ctaName,
    cta_location: location,
    cta_destination: destination || '',
  });
}

// Track form interactions
export function trackFormStart(formName: string) {
  trackEvent(ANALYTICS_EVENTS.FORM_START, { form_name: formName });
}

export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent(success ? ANALYTICS_EVENTS.FORM_SUBMIT : ANALYTICS_EVENTS.FORM_ERROR, {
    form_name: formName,
    success,
  });
}

// Track case study views
export function trackCaseStudyView(caseId: string, caseName: string) {
  trackEvent(ANALYTICS_EVENTS.CASE_STUDY_VIEW, {
    case_id: caseId,
    case_name: caseName,
  });
}

// Track ROI calculator usage
export function trackROICalculator(inputs: Record<string, number>, result: number) {
  trackEvent(ANALYTICS_EVENTS.ROI_CALCULATOR_USE, {
    ...inputs,
    calculated_roi: result,
  });
}

// Track social clicks
export function trackSocialClick(platform: string) {
  trackEvent(ANALYTICS_EVENTS.SOCIAL_CLICK, {
    platform,
  });
}

// Initialize analytics (call in app entry)
export function initAnalytics() {
  // GA4 initialization would go here
  // Meta Pixel initialization would go here
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] Initialized in dev mode');
  }
}

// Scroll depth tracking utility
export function initScrollTracking() {
  if (typeof window === 'undefined') return;
  
  const depths = [25, 50, 75, 100];
  const tracked = new Set<number>();
  
  const handler = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    depths.forEach((depth) => {
      if (scrollPercent >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        trackEvent(ANALYTICS_EVENTS.SCROLL_DEPTH, { depth });
      }
    });
  };
  
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

export default {
  trackEvent,
  trackPageView,
  trackCTAClick,
  trackFormStart,
  trackFormSubmit,
  trackCaseStudyView,
  trackROICalculator,
  trackSocialClick,
  initAnalytics,
  initScrollTracking,
};
