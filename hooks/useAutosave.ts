import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'processing' | 'error';

interface UseAutosaveOptions {
  noteId: string;
  delay?: number; // ms, default 2000
  onStatusChange?: (status: SaveStatus) => void;
}

export function useAutosave({
  noteId,
  delay = 2000,
  onStatusChange,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{ title?: string; content?: string }>({});

  const updateStatus = useCallback(
    (s: SaveStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange]
  );

  const save = useCallback(
    (patch: { title?: string; content?: string }) => {
      // Merge latest changes
      pendingRef.current = { ...pendingRef.current, ...patch };

      // Debounce
      if (timerRef.current) clearTimeout(timerRef.current);

      updateStatus('saving');

      timerRef.current = setTimeout(async () => {
        const payload = pendingRef.current;
        pendingRef.current = {};

        try {
          const res = await fetch(`/api/notes/${noteId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error('Save failed');

          const data = await res.json();
          // If content changed, AI is now processing
          updateStatus(data.status === 'processing' ? 'processing' : 'saved');
        } catch {
          updateStatus('error');
        }
      }, delay);
    },
    [noteId, delay, updateStatus]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { save, status };
}
