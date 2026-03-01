import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="p-5 border-b border-zinc-800">
          <Link
            href="/notes"
            className="text-lg font-bold text-white tracking-tight">
            Neuronote
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <Link
            href="/notes"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800">
            <span>📝</span> All notes
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors group"
            title="Sign out">
            ↩
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
