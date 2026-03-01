'use client';

import { motion } from 'framer-motion';

export function HeroIllustration() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-30">
      <motion.svg
        width="800"
        height="600"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[800px] max-w-none text-emerald-500/20">
        {/* Central Node */}
        <motion.circle
          cx="400"
          cy="300"
          r="40"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="12"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
        />

        {/* Connection Paths */}
        {[
          'M400 260 C400 150 250 150 200 100',
          'M400 260 C400 150 550 150 600 100',
          'M360 300 C200 300 150 450 100 500',
          'M440 300 C600 300 650 450 700 500',
          'M400 340 C400 450 250 450 200 550',
          'M400 340 C400 450 550 450 600 550',
        ].map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              delay: 0.5 + index * 0.2,
            }}
          />
        ))}

        {/* Outer Nodes */}
        {[
          { cx: 200, cy: 100 },
          { cx: 600, cy: 100 },
          { cx: 100, cy: 500 },
          { cx: 700, cy: 500 },
          { cx: 200, cy: 550 },
          { cx: 600, cy: 550 },
        ].map((circle, index) => (
          <motion.circle
            key={`outer-${index}`}
            cx={circle.cx}
            cy={circle.cy}
            r="6"
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: 2 + index * 0.2,
            }}
          />
        ))}

        {/* Traveling Particles */}
        {[
          { pathId: 0, delay: 3 },
          { pathId: 1, delay: 3.5 },
          { pathId: 2, delay: 4 },
          { pathId: 3, delay: 4.5 },
          { pathId: 4, delay: 5 },
          { pathId: 5, delay: 5.5 },
        ].map((particle, index) => (
          <motion.circle
            key={`particle-${index}`}
            r="3"
            fill="#34d399" // emerald-400
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={{
              offsetDistance: '100%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 1,
              delay: particle.delay,
            }}
            style={{
              offsetPath: `path('${
                [
                  'M400 260 C400 150 250 150 200 100',
                  'M400 260 C400 150 550 150 600 100',
                  'M360 300 C200 300 150 450 100 500',
                  'M440 300 C600 300 650 450 700 500',
                  'M400 340 C400 450 250 450 200 550',
                  'M400 340 C400 450 550 450 600 550',
                ][particle.pathId]
              }')`,
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
