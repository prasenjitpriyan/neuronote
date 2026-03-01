import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'bullmq',
    'ioredis',
    '@neondatabase/serverless',
    '@prisma/adapter-neon',
  ],
};

export default nextConfig;
