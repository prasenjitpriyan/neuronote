#!/usr/bin/env tsx
/**
 * Standalone worker entry point.
 * Run with: npx tsx scripts/start-worker.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Parse .env.local before anything else is required
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Dynamic import prevents hoisting so openai.ts evaluates AFTER env injection
import('../worker/noteWorker')
  .then(() => {
    console.log('[worker] Starting Neuronote AI worker...');
  })
  .catch((err) => {
    console.error('[worker] Worker crash:', err);
  });
