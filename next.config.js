/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    domains: ['upload.wikimedia.org', 'imgproxy.ra.co', 'www.visitberlin.de'],
  }
};

module.exports = nextConfig;