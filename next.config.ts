import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config: WebpackConfig) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    domains: ['upload.wikimedia.org', 'imgproxy.ra.co', 'www.visitberlin.de'],
  }
};

export default nextConfig;