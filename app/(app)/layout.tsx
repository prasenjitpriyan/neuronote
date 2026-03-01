import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SlideIn } from '@/components/motion/MotionWrappers';
import { LogOut, NotebookPen } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar / Header */}
      <SlideIn
        direction="left"
        distance={20}
        duration={0.6}
        className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-row md:flex-col items-center md:items-stretch justify-between z-10 bg-zinc-950">
        <div className="p-4 md:p-5 md:border-b border-zinc-800 flex items-center">
          <Link
            href="/notes"
            className="text-lg font-bold text-white tracking-tight">
            Neuronote
          </Link>
        </div>

        <nav className="flex-1 px-2 md:p-4 flex md:flex-col items-center md:items-stretch justify-center md:justify-start overflow-x-auto">
          <Link
            href="/notes"
            className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800 whitespace-nowrap">
            <NotebookPen className="w-4 h-4" /> All notes
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 md:border-t border-zinc-800 flex items-center gap-3 shrink-0">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="hidden md:block flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/logout"
            className="flex items-center justify-center p-2 md:px-3 md:py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors group"
            title="Sign out">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </SlideIn>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
