/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: true,
  experimental: {
    turbo: undefined,
  },
};

module.exports = nextConfig;
