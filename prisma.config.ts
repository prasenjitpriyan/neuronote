import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Next.js uses .env.local — load it explicitly for Prisma CLI
config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_DATABASE_URL is needed for migrations (Accelerate URL won't work for migrate)
    url: (process.env['DIRECT_DATABASE_URL'] ??
      process.env['DATABASE_URL']) as string,
  },
});
