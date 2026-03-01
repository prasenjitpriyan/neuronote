import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import NoteEditor from './NoteEditor';

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/');

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
    },
  });

  if (!note) notFound();

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link
          href="/notes"
          className="text-xs text-zinc-500 hover:text-white transition-colors">
          ← All notes
        </Link>
      </div>

      {/* Editor fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor note={note} />
      </div>
    </div>
  );
}
