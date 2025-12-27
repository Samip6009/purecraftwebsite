/**
 * Analytics Stubs - Pure Craft — Performance optimized
 * Deferred loading for analytics to not block initial render
 */

// Event names for consistent tracking
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  CASE_STUDY_VIEW: 'case_study_view',
  ROI_CALCULATOR_USE: 'roi_calculator_use',
  ROI_PRESET_SELECTED: 'roi_preset_selected',
  ROI_EXPORTED: 'roi_exported',
  ROI_COPIED: 'roi_copied',
  ROI_TIME_HORIZON: 'roi_time_horizon',
  CONTACT_PREFILL: 'contact_prefill',
  CONTACT_SUBMITTED: 'contact_submitted',
  MEDIA_PLAYED: 'media_played',
  MEDIA_PAUSED: 'media_paused',
  SOCIAL_CLICK: 'social_click',
  SHARE: 'share',
} as const;

// Queue for events before analytics loads
let eventQueue: Array<{ name: string; params?: Record<string, string | number | boolean> }> = [];
let analyticsReady = false;

// Track event - queues if analytics not ready
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!analyticsReady) {
    eventQueue.push({ name: eventName, params });
    return;
  }
  
  // Check if gtag exists (GA4)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, params);
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

// Flush queued events
function flushQueue() {
  eventQueue.forEach(({ name, params }) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as { gtag: (...args: unknown[]) => void }).gtag('event', name, params);
    }
  });
  eventQueue = [];
}

// Initialize analytics - DEFERRED (call in app entry after idle)
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  
  // Defer analytics initialization
  const init = () => {
    analyticsReady = true;
    flushQueue();
    
    if (import.meta.env.DEV) {
      console.log('[Analytics] Initialized (deferred)');
    }
  };
  
  // Use requestIdleCallback for deferred init
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(init, { timeout: 3000 });
  } else {
    setTimeout(init, 200);
  }
}

// Scroll depth tracking utility - optimized with throttle
export function initScrollTracking() {
  if (typeof window === 'undefined') return;
  
  const depths = [25, 50, 75, 100];
  const tracked = new Set<number>();
  let ticking = false;
  
  const checkScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    depths.forEach((depth) => {
      if (scrollPercent >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        trackEvent(ANALYTICS_EVENTS.SCROLL_DEPTH, { depth });
      }
    });
    ticking = false;
  };
  
  const handler = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(checkScroll);
    }
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
