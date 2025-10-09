# Performance Optimization Guide

This document outlines the changes made to optimize the website performance and fix the "chaining critical requests" issue.

## Changes Made

1. **Next.js Configuration Updates**
   - Added image optimization settings
   - Configured webpack to optimize CSS loading
   - Added experimental optimizations for CSS and package imports

2. **Layout Optimization**
   - Added preload directives for critical assets (fonts, images)
   - Added preconnect for external domains
   - Improved metadata for better SEO and performance

3. **CSS Optimization**
   - Created a critical CSS file that loads first
   - Moved non-critical styles to be loaded later
   - Used CSS classes instead of inline styles where possible

4. **Image Optimization**
   - Added script to generate optimized and responsive images
   - Created WebP versions of images for better compression
   - Added preloading for critical images

5. **Custom Document**
   - Added a custom _document.tsx file to optimize initial HTML loading
   - Added DNS prefetching for external resources

## How to Use

1. **Run the image optimization script before building:**
   ```bash
   npm run optimize-images
   ```

2. **Build for production with optimizations:**
   ```bash
   npm run build:prod
   ```

## Performance Monitoring

After implementing these changes, you should see improvements in:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Reduced network waterfall dependencies

## Additional Recommendations

1. **Consider using a CDN** for static assets to reduce latency
2. **Implement lazy loading** for below-the-fold images
3. **Add service worker** for caching and offline support
4. **Monitor performance** using tools like Lighthouse or WebPageTest

## References

- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Critical Rendering Path](https://web.dev/critical-rendering-path/)
