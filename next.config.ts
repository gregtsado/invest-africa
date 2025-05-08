import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  env: {
    GOOGLE_CLOUD_PROJECT: 'ahura-posts',
    GOOGLE_CLOUD_REGION: 'us-central1'
  }
};

export default nextConfig;
