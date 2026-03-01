#!/usr/bin/env tsx
/**
 * Standalone worker entry point.
 * Run with: npx tsx scripts/start-worker.ts
 */

import '../worker/noteWorker';

console.log('[worker] Starting Neuronote AI worker...');
