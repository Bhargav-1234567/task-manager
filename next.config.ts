import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 output: 'standalone', // Recommended for Netlify
  trailingSlash: true,
};

export default nextConfig;
