'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'completed', label: 'AI Ready ✨' },
  { value: 'processing', label: 'Processing…' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

export default function SearchNotes({
  availableTags,
}: {
  availableTags: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get('q') || '';
  const currentTag = searchParams.get('tag') || 'all';
  const currentStatus = searchParams.get('status') || 'all';

  const [query, setQuery] = useState(currentQuery);

  const updateUrlParams = useCallback(
    (newQuery: string, newTag: string, newStatus: string) => {
      const params = new URLSearchParams();
      if (newQuery) params.set('q', newQuery);
      if (newTag && newTag !== 'all') params.set('tag', newTag);
      if (newStatus && newStatus !== 'all') params.set('status', newStatus);

      startTransition(() => {
        router.push(`/notes?${params.toString()}`);
      });
    },
    [router]
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQuery) {
        updateUrlParams(query, currentTag, currentStatus);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, currentQuery, currentTag, currentStatus, updateUrlParams]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 space-y-4">
      <div className="relative">
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes by title, content, or AI summary..."
          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tag Filter */}
        <select
          value={currentTag}
          onChange={(e) =>
            updateUrlParams(query, e.target.value, currentStatus)
          }
          className="flex-1 bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer hover:border-zinc-700 transition-colors">
          <option value="all">All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={currentStatus}
          onChange={(e) => updateUrlParams(query, currentTag, e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer hover:border-zinc-700 transition-colors">
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {(currentQuery || currentTag !== 'all' || currentStatus !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              updateUrlParams('', 'all', 'all');
            }}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
