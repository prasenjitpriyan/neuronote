'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="relative flex justify-center items-center">
        {/* Outer glowing rings */}
        <div className="absolute w-24 h-24 border-2 border-emerald-500/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute w-16 h-16 border-2 border-emerald-400/40 rounded-full animate-pulse" />

        {/* Core glowing dot */}
        <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] shadow-emerald-400/50" />
      </div>

      <p className="mt-8 text-sm font-medium text-emerald-400/80 animate-pulse tracking-widest uppercase">
        Loading...
      </p>
    </div>
  );
}
