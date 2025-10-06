/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // Explicitly set the root to fix the lockfile warning
  },
  // Add other Next.js configuration options as needed
};

module.exports = nextConfig;
