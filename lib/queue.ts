import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// ─── Redis Connection ─────────────────────────────────────────────────────────
// For Upstash: set REDIS_URL to the ioredis-compatible URL
// e.g. rediss://:TOKEN@HOST:PORT
// For local Redis: redis://localhost:6379
export const redisConnection = new IORedis(
  process.env.REDIS_URL ?? 'redis://localhost:6379',
  {
    maxRetriesPerRequest: null, // required by BullMQ
    tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
  }
);

// ─── Queue ────────────────────────────────────────────────────────────────────
export const noteQueue = new Queue('note-ai-processing', {
  // @ts-expect-error bullmq and ioredis type mismatch
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: 100, // keep last 100 completed jobs
    removeOnFail: 200,
  },
});

// ─── Helper ───────────────────────────────────────────────────────────────────
export async function addNoteJob(noteId: string) {
  return noteQueue.add(
    'process-note',
    { noteId },
    { jobId: `note-${noteId}-${Date.now()}` }
  );
}
