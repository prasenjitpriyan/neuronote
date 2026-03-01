import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sseEmitter } from '@/worker/noteWorker';
import { NextRequest } from 'next/server';

// GET /api/notes/[id]/stream — Server-Sent Events for real-time AI updates
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
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

  const stream = new ReadableStream({
    start(controller) {
      // If already completed, send immediately and close
      if (note.status === 'completed') {
        const data = JSON.stringify({
          status: 'completed',
          summary: note.summary,
          tags: note.tags,
        });
        controller.enqueue(`data: ${data}\n\n`);
        controller.close();
        return;
      }

      const encoder = new TextEncoder();

      const listener = (payload: Record<string, unknown>) => {
        const data = JSON.stringify(payload);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        // Close stream after receiving terminal event
        if (payload.status === 'completed' || payload.status === 'failed') {
          sseEmitter.off(`note:${id}`, listener);
          controller.close();
        }
      };

      sseEmitter.on(`note:${id}`, listener);

      // Clean up if client disconnects
      _req.signal.addEventListener('abort', () => {
        sseEmitter.off(`note:${id}`, listener);
        controller.close();
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
