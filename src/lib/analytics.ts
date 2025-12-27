/**
 * Analytics — Env-driven GA4 + Meta Pixel
 * Loads analytics only when env IDs exist; async and non-blocking.
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

// Queue for events before GA4 loads
let eventQueue: Array<{ name: string; params?: Record<string, string | number | boolean> }> = [];
let ga4Ready = false;
let pixelReady = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: (...args: unknown[]) => void;
      loaded?: boolean;
      version?: string;
      (method: string, ...args: unknown[]): void;
    };
    _fbq?: unknown;
  }
}

// Track event - queues if analytics not ready
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;
  if (!(window as any).gtag) return;
  (window as any).gtag('event', eventName, { ...params });
};

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

  // Pixel conversion mapping (silent if disabled)
  const name = (ctaName || '').toLowerCase();
  const dest = (destination || '').toLowerCase();
  const isBookAction = name.includes('book') || name.includes('demo');
  const isContactAction = dest.startsWith('https://wa.me') || dest.startsWith('tel:');

  if (isBookAction) trackPixelConversion('Lead');
  if (isContactAction) trackPixelConversion('Contact');
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

// Load GA4 via env-driven script injection
function loadGA4() {
  const id = import.meta.env.VITE_GA4_ID as string | undefined;
  if (!id || typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    (window.dataLayer as unknown[]).push(arguments);
  } as unknown as typeof window.gtag;
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });

  ga4Ready = true;
  flushQueue();
}

// Load Meta Pixel via env-driven script injection (no <noscript>)
function loadMetaPixel() {
  const id = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  if (!id || typeof document === 'undefined') return;

  (function (f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) {
    if (f.fbq) return;
    n = f.fbq = function () {
      if ((n as any).callMethod) {
        (n as any).callMethod.apply(n, arguments);
      } else {
        (n as any).queue.push(arguments);
      }
    };
    if (!f._fbq) (f as any)._fbq = n;
    (n as any).push = (n as any);
    (n as any).loaded = true;
    (n as any).version = '2.0';
    (n as any).queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq?.('init', id);
  window.fbq?.('track', 'PageView');
  pixelReady = true;
}

// Initialize analytics — deferred, env-aware
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const init = () => {
    loadGA4();
    loadMetaPixel();
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(init, { timeout: 3000 });
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
  trackLeadConversion: () => trackPixelConversion('Lead'),
  trackContactConversion: () => trackPixelConversion('Contact'),
  trackFormStart,
  trackFormSubmit,
  trackCaseStudyView,
  trackROICalculator,
  trackSocialClick,
  initAnalytics,
  initScrollTracking,
};
