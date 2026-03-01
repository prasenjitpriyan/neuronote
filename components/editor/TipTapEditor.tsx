'use client';

import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';

interface TipTapEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const toggleClasses = (isActive: boolean) =>
    `p-1.5 rounded-md transition-colors ${
      isActive
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-4 p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={toggleClasses(editor.isActive('heading', { level: 1 }))}
        title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={toggleClasses(editor.isActive('heading', { level: 2 }))}
        title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={toggleClasses(editor.isActive('bold'))}
        title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={toggleClasses(editor.isActive('italic'))}
        title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={toggleClasses(editor.isActive('strike'))}
        title="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={toggleClasses(editor.isActive({ textAlign: 'left' }))}
        title="Align Left">
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={toggleClasses(editor.isActive({ textAlign: 'center' }))}
        title="Align Center">
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={toggleClasses(editor.isActive({ textAlign: 'right' }))}
        title="Align Right">
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={toggleClasses(editor.isActive({ textAlign: 'justify' }))}
        title="Justify">
        <AlignJustify className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toggleClasses(editor.isActive('bulletList'))}
        title="Bullet List">
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toggleClasses(editor.isActive('orderedList'))}
        title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={toggleClasses(editor.isActive('blockquote'))}
        title="Quote">
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={toggleClasses(editor.isActive('codeBlock'))}
        title="Code Block">
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
};

export function TipTapEditor({
  initialContent,
  onChange,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-zinc max-w-none w-full min-h-[300px] xl:min-h-0 bg-transparent outline-none text-sm leading-7',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {editable && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className="flex-1 w-full overflow-y-auto custom-editor cursor-text"
      />
    </div>
  );
}
