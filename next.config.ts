import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
