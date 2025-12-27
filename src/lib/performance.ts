/**
 * Performance utilities for Pure Craft
 * Lazy loading, deferred hydration, and optimization helpers
 */
import React, { lazy, Suspense, useEffect, useState, memo, createElement, Fragment } from 'react';
import type { ComponentType, ReactNode } from 'react';

// Type for component props
type AnyProps = Record<string, unknown>;

/**
 * Creates a lazy component that only loads after requestIdleCallback
 * Falls back to immediate load if requestIdleCallback not available
 */
export function lazyWithIdle(
  importFn: () => Promise<{ default: ComponentType<AnyProps> }>,
  fallback: ReactNode = null
): ComponentType<AnyProps> {
  const LazyComponent = lazy(importFn);
  
  const IdleLazyComponent = memo(function IdleLazyComponent(props: AnyProps) {
    const [shouldLoad, setShouldLoad] = useState(false);
    
    useEffect(() => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
        return () => window.cancelIdleCallback(id);
      } else {
        // Fallback for Safari
        const timer = setTimeout(() => setShouldLoad(true), 100);
        return () => clearTimeout(timer);
      }
    }, []);
    
    if (!shouldLoad) {
      return createElement(Fragment, null, fallback);
    }
    
    return createElement(Suspense, { fallback }, createElement(LazyComponent, props));
  });

  return IdleLazyComponent;
}

/**
 * Creates a lazy component that loads on viewport intersection
 */
export function lazyWithIntersection(
  importFn: () => Promise<{ default: ComponentType<AnyProps> }>,
  options: {
    rootMargin?: string;
    fallback?: ReactNode;
    placeholder?: ReactNode;
  } = {}
): ComponentType<AnyProps> {
  const { rootMargin = '200px', fallback = null, placeholder = null } = options;
  const LazyComponent = lazy(importFn);
  
  const IntersectionLazyComponent = memo(function IntersectionLazyComponent(props: AnyProps) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);
    
    useEffect(() => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      
      observer.observe(ref);
      return () => observer.disconnect();
    }, [ref, rootMargin]);
    
    if (!shouldLoad) {
      return createElement('div', { ref: setRef }, placeholder);
    }
    
    return createElement(Suspense, { fallback }, createElement(LazyComponent, props));
  });

  return IntersectionLazyComponent;
}

/**
 * Preload a component on hover or focus
 */
export function createPreloadableComponent(
  importFn: () => Promise<{ default: ComponentType<AnyProps> }>
): { Component: ComponentType<AnyProps>; preload: () => void } {
  const LazyComponent = lazy(importFn);
  let preloaded = false;
  
  const preload = () => {
    if (!preloaded) {
      preloaded = true;
      importFn();
    }
  };
  
  const Component = memo(function PreloadableComponent(props: AnyProps) {
    return createElement(Suspense, { fallback: null }, createElement(LazyComponent, props));
  });
  
  return { Component, preload };
}

/**
 * Deferred initialization for non-critical scripts
 */
export function deferInit(fn: () => void, priority: 'idle' | 'interaction' | 'visible' = 'idle'): () => void {
  let cleanup: (() => void) | undefined;
  
  if (priority === 'idle') {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(fn, { timeout: 3000 });
      cleanup = () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(fn, 200);
      cleanup = () => clearTimeout(timer);
    }
  } else if (priority === 'interaction') {
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    const handler = () => {
      fn();
      events.forEach(e => window.removeEventListener(e, handler, { capture: true }));
    };
    events.forEach(e => window.addEventListener(e, handler, { capture: true, once: true, passive: true }));
    cleanup = () => events.forEach(e => window.removeEventListener(e, handler, { capture: true }));
  }
  
  return cleanup || (() => {});
}
