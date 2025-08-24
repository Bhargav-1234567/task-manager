/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Netlify
  // output: "standalone",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // Add these for better compatibility
  images: {
    unoptimized: true,
  },
  // Ensure proper build output
  distDir: ".next",
};

module.exports = nextConfig;
