/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  // Page generation timeout
  staticPageGenerationTimeout: 1000,
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: false,
  // Disable ETags to prevent caching issues during development
  generateEtags: false,
  // Image optimization
  images: {
    unoptimized: true,
  },
  // Webpack configuration for HMR
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig