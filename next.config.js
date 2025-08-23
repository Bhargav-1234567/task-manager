/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Netlify
  // output: "standalone",
  trailingSlash: true,
  // Add these for better compatibility
  images: {
    unoptimized: true,
  },
  // Ensure proper build output
  distDir: ".next",
};

module.exports = nextConfig;
