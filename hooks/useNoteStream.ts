import { useEffect, useState } from 'react';

interface NoteStreamState {
  summary: string | null;
  tags: string[];
  status: 'processing' | 'completed' | 'failed' | null;
  error: string | null;
}

export function useNoteStream(noteId: string, initialStatus: string) {
  const [state, setState] = useState<NoteStreamState>({
    summary: null,
    tags: [],
    status: initialStatus === 'processing' ? 'processing' : null,
    error: null,
  });

  useEffect(() => {
    // Only open SSE when note is processing
    if (initialStatus !== 'processing' && initialStatus !== 'pending') return;

    const eventSource = new EventSource(`/api/notes/${noteId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState({
          summary: data.summary ?? null,
          tags: data.tags ?? [],
          status: data.status,
          error: data.error ?? null,
        });
        // Close when terminal state reached
        if (data.status === 'completed' || data.status === 'failed') {
          eventSource.close();
        }
      } catch {
        // Ignore malformed events
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [noteId, initialStatus]);

  return state;
}
