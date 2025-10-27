/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // Explicitly set the root to fix the lockfile warning
  },
  // Performance optimizations
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com','badellah-stg-bucket.s3.me-south-1.amazonaws.com/'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Improve asset loading
  webpack: (config) => {
    // Optimize CSS
    config.optimization.splitChunks.cacheGroups = {
      ...config.optimization.splitChunks.cacheGroups,
      styles: {
        test: /\.css$/,
        name: 'styles',
        priority: 10,
        enforce: true,
      },
    };
    return config;
  },
};

module.exports = nextConfig;
