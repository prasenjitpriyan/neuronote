'use client';

import { motion } from 'framer-motion';

export function AnimatedDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full overflow-hidden flex items-center justify-center ${className}`}>
      <motion.svg
        width="100%"
        height="2"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}>
        <motion.path
          d="M0,1 L1000,1"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: 1.5, ease: 'easeOut' },
                opacity: { duration: 0.2 },
              },
            },
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#34d399" /> {/* emerald-400 */}
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
