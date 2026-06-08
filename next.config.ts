import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./content/blog/**/*'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
