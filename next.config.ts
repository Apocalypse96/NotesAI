import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Ignoring TypeScript errors during build
    // Remove this when you want to enforce type checking
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Ignoring ESLint errors during build
    // Remove this when you want to enforce linting
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
