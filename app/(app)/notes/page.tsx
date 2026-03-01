import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type NoteListItem = {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary: string | null;
  tags: string[];
  updatedAt: Date;
};

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-zinc-700 text-zinc-300' },
  processing: {
    label: 'Processing…',
    className: 'bg-amber-900/60 text-amber-300 animate-pulse',
  },
  completed: {
    label: 'AI Ready ✨',
    className: 'bg-emerald-900/60 text-emerald-300',
  },
  failed: { label: 'Failed', className: 'bg-red-900/60 text-red-300' },
} as const;

async function createNote(userId: string) {
  'use server';
  const { prisma: db } = await import('@/lib/prisma');

  const note = await db.note.create({
    data: { userId, title: 'Untitled', content: '' },
  });

  redirect(`/notes/${note.id}`);
}

export default async function NotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/');

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      status: true,
      summary: true,
      tags: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const createNoteWithUser = createNote.bind(null, session.user.id);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your notes</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <form action={createNoteWithUser}>
          <button
            type="submit"
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl hover:bg-zinc-100 transition-colors">
            + New note
          </button>
        </form>
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="text-center py-24 text-zinc-600">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">No notes yet. Create your first one!</p>
        </div>
      )}

      {/* Notes grid */}
      <ul className="space-y-3">
        {notes.map((note: NoteListItem) => {
          const sc = statusConfig[note.status];
          return (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {note.title || 'Untitled'}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${sc.className}`}>
                    {sc.label}
                  </span>
                </div>

                {note.summary && (
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                )}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {note.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-zinc-600 mt-3">
                  {new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(note.updatedAt))}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
