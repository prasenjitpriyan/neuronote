import { Worker } from 'bullmq';
import {
  generateEmbedding,
  generateSummary,
  generateTags,
} from '../lib/openai';
import { prisma } from '../lib/prisma';
import { redisConnection } from '../lib/queue';

// ─── Worker ───────────────────────────────────────────────────────────────────
const worker = new Worker(
  'note-ai-processing',
  async (job) => {
    const { noteId } = job.data as { noteId: string };

    // Mark as processing
    await prisma.note.update({
      where: { id: noteId },
      data: { status: 'processing' },
    });

    // Fetch note content
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { content: true },
    });

    if (!note) throw new Error(`Note ${noteId} not found`);

    console.log(`[worker] Processing note ${noteId}...`);

    // ── Step A: Summary ───────────────────────────────────────────────────────
    job.updateProgress(10);
    const summary = await generateSummary(note.content);
    console.log(`[worker] Summary done for ${noteId}`);

    // ── Step B: Tags ──────────────────────────────────────────────────────────
    job.updateProgress(40);
    const tags = await generateTags(note.content);
    console.log(`[worker] Tags done for ${noteId}:`, tags);

    // ── Step C: Embedding ─────────────────────────────────────────────────────
    job.updateProgress(70);
    const embedding = await generateEmbedding(note.content);
    const vectorLiteral = `[${embedding.join(',')}]`;
    console.log(`[worker] Embedding done for ${noteId}`);

    // ── Atomic DB Update ──────────────────────────────────────────────────────
    job.updateProgress(90);
    await prisma.$executeRaw`
      UPDATE "Note"
      SET
        summary       = ${summary},
        tags          = ${tags}::"text"[],
        embedding     = ${vectorLiteral}::vector,
        status        = 'completed'::"NoteStatus",
        "errorMessage" = NULL,
        "updatedAt"   = NOW()
      WHERE id = ${noteId}
    `;

    job.updateProgress(100);
    console.log(`[worker] ✅ Note ${noteId} complete`);

    // ── Notify SSE clients ────────────────────────────────────────────────────
    redisConnection.publish(
      `note:${noteId}`,
      JSON.stringify({ summary, tags, status: 'completed' })
    );
  },
  {
    // @ts-expect-error bullmq and ioredis type mismatch
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on('failed', async (job, err) => {
  if (!job) return;
  const { noteId } = job.data as { noteId: string };
  console.error(`[worker] ❌ Note ${noteId} failed:`, err.message);

  await prisma.note.update({
    where: { id: noteId },
    data: {
      status: 'failed',
      errorMessage: err.message,
    },
  });

  redisConnection.publish(
    `note:${noteId}`,
    JSON.stringify({
      status: 'failed',
      error: err.message,
    })
  );
});

worker.on('ready', () => console.log('[worker] 🟢 Worker ready'));
worker.on('error', (err) => console.error('[worker] Worker error:', err));

export default worker;
