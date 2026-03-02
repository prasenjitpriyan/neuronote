'use client';

import { Check, Loader2, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteNoteButtonProps {
  noteId: string;
  redirectToNotesList?: boolean;
}

export default function DeleteNoteButton({
  noteId,
  redirectToNotesList = false,
}: DeleteNoteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete note');
      }

      if (redirectToNotesList) {
        router.push('/notes');
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const cancelConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 bg-red-950/30 rounded-lg p-1 border border-red-900/50">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 text-red-400 hover:bg-red-900/50 rounded transition-colors"
          title="Confirm Delete">
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={cancelConfirm}
          disabled={isDeleting}
          className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
          title="Cancel">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors ${
        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Delete Note">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
