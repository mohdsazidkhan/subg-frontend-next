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
}

module.exports = nextConfig