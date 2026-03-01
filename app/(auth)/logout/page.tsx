'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 animate-pulse"></div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Sign out
            </h1>
            <p className="text-zinc-400">
              Are you sure you want to sign out of Neuronote?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full relative group flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 disabled:hover:bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl font-medium transition-all duration-200 overflow-hidden">
              {isLoading ? (
                <div className="size-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Yes, sign me out
                </>
              )}
              <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent group-hover:via-red-500/60 transition-colors"></div>
            </button>

            <button
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full relative group flex items-center justify-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 disabled:opacity-50 border border-zinc-700/50 text-white p-3.5 rounded-xl font-medium transition-all duration-200">
              Cancel
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Return to home
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
}
