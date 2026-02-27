import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.baddelha.com.sa',
          },
        ],
        destination: 'https://baddelha.com.sa/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
