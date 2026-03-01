'use client';

import { SaveStatus, useAutosave } from '@/hooks/useAutosave';
import { useNoteStream } from '@/hooks/useNoteStream';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface NoteEditorProps {
  note: {
    id: string;
    title: string;
    content: string;
    summary: string | null;
    tags: string[];
    status: string;
  };
}

const statusLabel: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved ✓',
  processing: 'AI processing…',
  error: 'Save failed',
};

const statusColor: Record<SaveStatus, string> = {
  idle: 'text-zinc-600',
  saving: 'text-zinc-400',
  saved: 'text-emerald-400',
  processing: 'text-amber-400',
  error: 'text-red-400',
};

export default function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const { save } = useAutosave({
    noteId: note.id,
    delay: 2000,
    onStatusChange: setSaveStatus,
  });

  // SSE — real-time AI result
  const stream = useNoteStream(note.id, note.status);

  const displaySummary = stream.summary ?? note.summary;
  const displayTags = stream.tags.length > 0 ? stream.tags : note.tags;
  const isAiReady =
    stream.status === 'completed' || note.status === 'completed';
  const isAiFailed = stream.status === 'failed' || note.status === 'failed';

  return (
    <div className="flex flex-col xl:flex-row h-full overflow-y-auto xl:overflow-hidden">
      {/* Editor area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col p-4 sm:p-8 max-w-2xl mx-auto w-full min-h-[500px] xl:min-h-0 xl:overflow-y-auto shrink-0 xl:shrink">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-6">
          <span
            className={`text-xs transition-all duration-300 ${statusColor[saveStatus]}`}>
            {statusLabel[saveStatus]}
          </span>
          {saveStatus === 'processing' && (
            <span className="text-xs text-amber-400 animate-pulse">
              🧠 AI is summarizing…
            </span>
          )}
          {isAiReady &&
            saveStatus !== 'saving' &&
            saveStatus !== 'processing' && (
              <span className="text-xs text-emerald-400">
                ✨ AI processing complete
              </span>
            )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            save({ title: e.target.value });
          }}
          placeholder="Untitled"
          className="w-full bg-transparent text-3xl font-bold text-white placeholder-zinc-700 outline-none mb-4 border-none"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            save({ content: e.target.value });
          }}
          placeholder="Start writing…"
          className="flex-1 w-full bg-transparent text-zinc-300 placeholder-zinc-700 outline-none resize-none text-sm leading-7 border-none min-h-[300px] xl:min-h-0"
          autoFocus
        />
      </motion.div>

      {/* AI panel */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full xl:w-72 shrink-0 border-t xl:border-t-0 xl:border-l border-zinc-800 p-4 sm:p-6 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            AI Summary
          </h3>
          {displaySummary ? (
            <p className="text-sm text-zinc-400 leading-relaxed">
              {displaySummary}
            </p>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-3 rounded bg-zinc-800 ${
                    saveStatus === 'processing' ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${[100, 85, 70][i - 1]}%` }}
                />
              ))}
              {saveStatus !== 'processing' && (
                <p className="text-xs text-zinc-700 pt-1">
                  Summary appears after save
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Tags
          </h3>
          {displayTags.length > 0 ? (
            <motion.div layout className="flex flex-wrap gap-2">
              <AnimatePresence>
                {displayTags.map((tag) => (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    key={tag}
                    className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
                    #{tag}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-5 w-14 rounded bg-zinc-800 ${
                    saveStatus === 'processing' ? 'animate-pulse' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {isAiFailed && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <p className="text-xs text-red-400">
              AI processing failed. Will retry on next save.
            </p>
          </div>
        )}
      </motion.aside>
    </div>
  );
}
