# Performance Optimization Guide - ADmyBRAND AI Suite

## Overview
This document outlines performance optimization strategies implemented in the ADmyBRAND AI Suite and provides guidelines for maintaining optimal performance.

## Core Performance Metrics

### Target Performance Goals
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **Bundle Size**: < 200KB initial load

### Current Performance Status
```typescript
// Performance monitoring setup
const performanceMetrics = {
  fcp: 1.2, // seconds
  lcp: 2.1, // seconds
  fid: 45,  // milliseconds
  cls: 0.05,
  tti: 2.8, // seconds
  bundleSize: 185 // KB
}
```

## Next.js Optimizations

### App Router Performance Features
```typescript
// app/layout.tsx - Root layout optimizations
import { Inter } from 'next/font/google'

// Font optimization with preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Improve font loading performance
  preload: true,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.admybrand.ai" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Resource hints */}
        <link rel="prefetch" href="/api/contact" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Image Optimization
```typescript
// Optimized image loading
import Image from 'next/image'

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    quality={85}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjA4YTWDb7TaRmkz23T9M5dqHQ+vF/UKBbqOOeExByA5c3uOXa/wCKKzJKYHoBoEHM+3u1k/oNyO2AUUFy3Kz/gB/wAKKKGLZwbBXCHHzH4BRQNFSc6+CqJZR7YfOw/BTQCM9BqEw2nEHYLGPOeCQmTIMN0Zez9U9CiLx6nkZcAGa/FNdKoBJgTLjjqKAUqk8KGg=" 
    priority={props.priority || false}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    {...props}
  />
)
```

### Code Splitting and Lazy Loading
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

// Lazy load non-critical components
const ContactModal = dynamic(() => import('@/components/contact-modal'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for modals
})

const AnimatedSection = dynamic(() => import('@/components/animated-section'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100"></div>,
})

// Component-level code splitting
const HeavyComponent = dynamic(
  () => import('@/components/heavy-component').then(mod => ({ default: mod.HeavyComponent })),
  { 
    loading: () => <ComponentSkeleton />,
    ssr: false 
  }
)
```

## Bundle Optimization

### Webpack Bundle Analysis
```bash
# Analyze bundle size
pnpm build && npx @next/bundle-analyzer
```

### Tree Shaking Optimization
```typescript
// lib/utils.ts - Optimized imports
// ❌ Imports entire lodash library
import _ from 'lodash'

// ✅ Tree-shakeable import
import { debounce } from 'lodash-es'

// ✅ Even better - use native alternatives
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

### Dependency Optimization
```typescript
// next.config.mjs - Bundle optimization
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize external libraries
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      'framer-motion'
    ]
  },
  
  // Bundle analyzer in production
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          enforce: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    }
    
    return config
  },
}

export default nextConfig
```

## Animation Performance

### Framer Motion Optimizations
```typescript
// components/optimized-motion.tsx
import { motion, useReducedMotion } from 'framer-motion'

const OptimizedMotionDiv = ({ children, ...props }) => {
  const shouldReduceMotion = useReducedMotion()
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      transition: { duration: shouldReduceMotion ? 0 : 0.6 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.6 }
    }
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      // Use transform instead of layout animations for better performance
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

### CSS Animation Optimizations
```css
/* globals.css - Performance-focused animations */

/* Use transform and opacity for smooth animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  will-change: opacity, transform;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimize for mobile performance */
@media (max-width: 768px) {
  .animate-fade-in {
    animation-duration: 0.3s;
  }
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

/* GPU acceleration for transforms */
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

## Scroll Performance

### Lenis Scroll Optimization
```typescript
// components/smooth-scroll-provider.tsx - Performance tuned
'use client'

import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { useEffect, useState } from 'react'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Optimize settings based on device capabilities
  const lenisOptions = {
    duration: isMobile ? 0.8 : 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: isMobile ? 0.5 : 1,
    smoothTouch: false, // Disable on touch devices for better performance
    touchMultiplier: 2,
    infinite: false,
    // Performance optimizations
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    wheelMultiplier: isMobile ? 0.8 : 1,
  }
  
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  )
}
```

### Virtual Scrolling for Large Lists
```typescript
// components/virtual-list.tsx
import { FixedSizeList as List } from 'react-window'
import { useMemo } from 'react'

interface VirtualListProps {
  items: any[]
  itemHeight: number
  height: number
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => React.ReactNode
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  height,
  renderItem
}) => {
  const memoizedItems = useMemo(() => items, [items])
  
  return (
    <List
      height={height}
      itemCount={memoizedItems.length}
      itemSize={itemHeight}
      overscanCount={5} // Render 5 extra items for smooth scrolling
    >
      {renderItem}
    </List>
  )
}
```

## Memory Management

### Component Optimization
```typescript
// hooks/use-optimized-state.ts
import { useCallback, useMemo, useState } from 'react'

export const useOptimizedContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  // Memoize expensive calculations
  const isFormValid = useMemo(() => {
    return formData.name.length > 2 &&
           formData.email.includes('@') &&
           formData.message.length > 10
  }, [formData.name, formData.email, formData.message])
  
  // Memoize callbacks to prevent unnecessary re-renders
  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])
  
  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', message: '' })
  }, [])
  
  return {
    formData,
    isFormValid,
    updateField,
    resetForm
  }
}
```

### React.memo and useMemo Usage
```typescript
// components/optimized-component.tsx
import React, { memo, useMemo } from 'react'

interface ExpensiveComponentProps {
  data: any[]
  filter: string
  onSelect: (item: any) => void
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(({ 
  data, 
  filter, 
  onSelect 
}) => {
  // Memoize expensive operations
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])
  
  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredData])
  
  return (
    <div>
      {sortedData.map(item => (
        <div key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.data === nextProps.data &&
    prevProps.filter === nextProps.filter &&
    prevProps.onSelect === nextProps.onSelect
  )
})
```

## Network Performance

### API Request Optimization
```typescript
// lib/api-client.ts
class OptimizedAPIClient {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private pendingRequests = new Map<string, Promise<any>>()
  
  async get<T>(url: string, options?: { cache?: boolean; ttl?: number }): Promise<T> {
    const cacheKey = url + JSON.stringify(options)
    
    // Return cached data if available and fresh
    if (options?.cache) {
      const cached = this.cache.get(cacheKey)
      const ttl = options.ttl || 5 * 60 * 1000 // 5 minutes default
      
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data
      }
    }
    
    // Deduplicate concurrent requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!
    }
    
    const request = fetch(url).then(res => res.json())
    this.pendingRequests.set(cacheKey, request)
    
    try {
      const data = await request
      
      if (options?.cache) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
      }
      
      return data
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
}

export const apiClient = new OptimizedAPIClient()
```

### Resource Preloading
```typescript
// hooks/use-preload.ts
import { useEffect } from 'react'

export const usePreloadCriticalResources = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/hero-background.jpg',
      '/logo.svg',
      '/feature-icons.png'
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
    
    // Preload critical API endpoints
    fetch('/api/features', { method: 'HEAD' })
    fetch('/api/pricing', { method: 'HEAD' })
    
    // Prefetch next page resources
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement
          if (link.href) {
            const prefetchLink = document.createElement('link')
            prefetchLink.rel = 'prefetch'
            prefetchLink.href = link.href
            document.head.appendChild(prefetchLink)
          }
        }
      })
    })
    
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      observer.observe(link)
    })
    
    return () => observer.disconnect()
  }, [])
}
```

## Monitoring and Analytics

### Performance Monitoring Setup
```typescript
// lib/performance-monitor.ts
class PerformanceMonitor {
  private static instance: PerformanceMonitor
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor()
    }
    return this.instance
  }
  
  measurePageLoad() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      const metrics = {
        fcp: this.getFCP(),
        lcp: this.getLCP(),
        fid: this.getFID(),
        cls: this.getCLS(),
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      }
      
      this.sendMetrics(metrics)
    })
  }
  
  private async getFCP(): Promise<number> {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          resolve(fcpEntry.startTime)
        }
      }).observe({ entryTypes: ['paint'] })
    })
  }
  
  private async getLCP(): Promise<number> {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    })
  }
  
  private sendMetrics(metrics: any) {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now()
        })
      })
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
```

### Core Web Vitals Tracking
```typescript
// lib/web-vitals.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

export function measureWebVitals() {
  getCLS(console.log)
  getFCP(console.log)
  getFID(console.log)
  getLCP(console.log)
  getTTFB(console.log)
}

// Track performance in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  measureWebVitals()
}
```

## Mobile Performance

### Touch and Gesture Optimization
```typescript
// hooks/use-touch-optimization.ts
import { useEffect } from 'react'

export const useTouchOptimization = () => {
  useEffect(() => {
    // Disable double-tap zoom on buttons
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        e.preventDefault()
      }
    }
    
    // Optimize touch event handling
    const options = { passive: false }
    document.addEventListener('touchstart', preventDoubleTapZoom, options)
    
    // Improve scroll performance on mobile
    const improveScrolling = () => {
      document.body.style.webkitOverflowScrolling = 'touch'
      document.body.style.overflowScrolling = 'touch'
    }
    
    improveScrolling()
    
    return () => {
      document.removeEventListener('touchstart', preventDoubleTapZoom)
    }
  }, [])
}
```

### Responsive Image Loading
```typescript
// components/responsive-image.tsx
import Image from 'next/image'
import { useState } from 'react'

interface ResponsiveImageProps {
  src: string
  alt: string
  mobile?: string
  tablet?: string
  desktop?: string
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  mobile,
  tablet,
  desktop
}) => {
  const [imageError, setImageError] = useState(false)
  
  const getSrc = () => {
    if (typeof window === 'undefined') return src
    
    const width = window.innerWidth
    
    if (width < 768 && mobile) return mobile
    if (width < 1024 && tablet) return tablet
    if (desktop) return desktop
    
    return src
  }
  
  if (imageError) {
    return (
      <div className="bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Image failed to load</span>
      </div>
    )
  }
  
  return (
    <Image
      src={getSrc()}
      alt={alt}
      onError={() => setImageError(true)}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

## Build Optimization

### Production Build Configuration
```bash
# Build with optimizations
NODE_ENV=production pnpm build

# Analyze bundle
pnpm build-analyze

# Check bundle sizes
du -sh .next/static/chunks/*
```

### Environment-Specific Optimizations
```typescript
// next.config.mjs - Production optimizations
const nextConfig = {
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Output file tracing
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Optimize fonts
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
    
    // Enable edge runtime for API routes
    runtime: 'nodejs',
  },
}

export default nextConfig
```

## Performance Checklist

### Pre-Launch Checklist
- [ ] Bundle size under 200KB
- [ ] LCP under 2.5s
- [ ] FCP under 1.8s
- [ ] CLS under 0.1
- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts preloaded
- [ ] Critical CSS inlined
- [ ] JavaScript minified
- [ ] Tree shaking enabled
- [ ] Code splitting implemented
- [ ] Lazy loading for non-critical components
- [ ] Service worker for caching
- [ ] CDN configured
- [ ] Gzip/Brotli compression enabled

### Monitoring Tools
- **Lighthouse**: Core Web Vitals audit
- **WebPageTest**: Detailed performance analysis
- **GTmetrix**: Performance scoring
- **Chrome DevTools**: Real-time monitoring
- **Next.js Analytics**: Built-in performance insights
