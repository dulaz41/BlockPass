/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    };
  },
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'encrypted-tbn0.gstatic.com',
    ],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
