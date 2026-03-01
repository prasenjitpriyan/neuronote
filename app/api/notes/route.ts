import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { addNoteJob } from '@/lib/queue';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notes — list current user's notes
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      status: true,
      summary: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(notes);
}

// POST /api/notes — create a new note and queue AI processing
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title = 'Untitled', content = '' } = body;

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title,
      content,
      status: content.trim() ? 'processing' : 'pending',
    },
  });

  // Queue AI processing only if there's content
  if (content.trim()) {
    await addNoteJob(note.id);
  }

  return NextResponse.json(note, { status: 201 });
}
