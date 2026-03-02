'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function HoverCardSpotlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 ${className}`}
      onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(167, 139, 250, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative flex h-full flex-col p-5 z-10 transition-colors duration-300 group-hover:border-zinc-700">
        {children}
      </div>
    </div>
  );
}
