import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

// GET /api/notes/[id]/stream — Server-Sent Events for real-time AI updates
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await params;

  // Verify the note belongs to this user
  const note = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, status: true, summary: true, tags: true },
  });

  if (!note) {
    return new Response('Not found', { status: 404 });
  }

  // Redis instance for subscription
  const subscriber = new Redis(
    process.env.REDIS_URL ?? 'redis://localhost:6379',
    { tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined }
  );

  const stream = new ReadableStream({
    async start(controller) {
      // If already completed, send immediately and close
      if (note.status === 'completed') {
        const data = JSON.stringify({
          status: 'completed',
          summary: note.summary,
          tags: note.tags,
        });
        controller.enqueue(`data: ${data}\n\n`);
        controller.close();
        await subscriber.quit();
        return;
      }

      await subscriber.subscribe(`note:${id}`);

      const encoder = new TextEncoder();

      subscriber.on('message', (channel, message) => {
        if (channel === `note:${id}`) {
          const payload = JSON.parse(message);
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));

          if (payload.status === 'completed' || payload.status === 'failed') {
            subscriber.unsubscribe(`note:${id}`).finally(() => {
              subscriber.quit();
              controller.close();
            });
          }
        }
      });

      // Clean up if client disconnects
      _req.signal.addEventListener('abort', () => {
        subscriber.unsubscribe(`note:${id}`).finally(() => {
          subscriber.quit();
          controller.close();
        });
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
