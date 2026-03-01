import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addNoteJob } from '@/lib/queue';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notes/[id] — fetch single note
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const note = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      title: true,
      content: true,
      summary: true,
      tags: true,
      status: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!note) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(note);
}

// PATCH /api/notes/[id] — autosave update, re-queues AI on content change
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content } = body;

  // Verify ownership
  const existing = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, content: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const contentChanged = content !== undefined && content !== existing.content;

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      // Reset AI fields only if content actually changed
      ...(contentChanged && {
        status: 'processing',
        summary: null,
        tags: [],
        errorMessage: null,
      }),
    },
  });

  // Re-queue AI job only if content changed
  if (contentChanged && content.trim()) {
    await addNoteJob(id);
  }

  return NextResponse.json({ id: note.id, status: note.status });
}

// DELETE /api/notes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.note.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
