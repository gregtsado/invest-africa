/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Or any other size that you need
      allowedOrigins: ['*'], // Or specific origins
    },
  },
  env: {
    GOOGLE_CLOUD_PROJECT: 'ahura-posts',
    GOOGLE_CLOUD_REGION: 'us-central1',
  },
};

export default nextConfig;
