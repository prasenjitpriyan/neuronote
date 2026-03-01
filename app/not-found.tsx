'use client';

import { motion } from 'framer-motion';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-emerald-500/30">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Floating Icons */}
        <div className="relative h-40 w-full flex justify-center items-center mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute">
            <span className="text-[120px] font-black text-transparent bg-clip-text bg-linear-to-b from-zinc-700 to-zinc-900 select-none">
              404
            </span>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="absolute z-10 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-2xl shadow-emerald-500/20">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <FileQuestion
                className="w-12 h-12 text-emerald-400"
                strokeWidth={1.5}
              />
            </motion.div>
          </motion.div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -left-4 top-4 text-zinc-600">
            <Search className="w-6 h-6" />
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute -right-2 bottom-4 text-zinc-700">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
          </motion.div>
        </div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Lost your train of thought?
          </h1>
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm">
            We couldn&apos;t find the page you&apos;re looking for. It might
            have been deleted, moved, or never existed in your neural network
            layout in the first place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-zinc-900 transition-colors">
                <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Return Home</span>
              </div>
            </Link>

            <Link
              href="/notes"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-zinc-400 hover:text-white font-medium px-6 py-3 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900 transition-all">
              <Search className="w-4 h-4" />
              <span>Search Notes</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative footer line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent"
      />
    </div>
  );
}
