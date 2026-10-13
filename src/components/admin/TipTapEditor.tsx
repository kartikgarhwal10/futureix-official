"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Table as TableExtension,
  TableRow as TableRowExtension,
  TableCell as TableCellExtension,
  TableHeader as TableHeaderExtension,
} from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";
import { useEffect } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ content, onChange, placeholder = "Write your article content here..." }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-signal font-semibold underline underline-offset-2",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-2xl max-w-full my-6 border border-black/10 shadow-md",
        },
      }),
      TableExtension.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-6 text-sm",
        },
      }),
      TableRowExtension,
      TableHeaderExtension.configure({
        HTMLAttributes: {
          class: "border border-black/20 bg-black/5 p-2 font-bold text-left",
        },
      }),
      TableCellExtension.configure({
        HTMLAttributes: {
          class: "border border-black/15 p-2",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none min-h-[360px] p-5 sm:p-7 outline-none text-foreground leading-relaxed font-sans text-sm sm:text-base",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes if editor differs
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-64 rounded-2xl bg-black/5 animate-pulse flex items-center justify-center text-xs text-muted">
        Loading editor suite...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter destination URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL or asset link:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // Word count & reading time
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.ceil(wordCount / 200);

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-[#f8f6f0] sticky top-0 z-10 select-none">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            editor.isActive("paragraph") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Paragraph text"
        >
          <Pilcrow size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            editor.isActive("heading", { level: 4 }) ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Heading 4"
        >
          <Heading4 size={14} />
        </button>

        <div className="h-4 w-[1px] bg-black/15 mx-1" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("bold") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("italic") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("strike") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("code") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Inline Code"
        >
          <Code size={14} />
        </button>

        <div className="h-4 w-[1px] bg-black/15 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("bulletList") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("orderedList") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("blockquote") ? "bg-foreground text-background" : "hover:bg-black/10 text-muted"
          }`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-xs hover:bg-black/10 text-muted transition-colors"
          title="Horizontal Divider"
        >
          <Minus size={14} />
        </button>

        <div className="h-4 w-[1px] bg-black/15 mx-1" />

        {/* Links, Media & Tables */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive("link") ? "bg-signal text-white" : "hover:bg-black/10 text-muted"
          }`}
          title="Add / Edit Link"
        >
          <LinkIcon size={14} />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg text-xs hover:bg-black/10 text-muted transition-colors"
            title="Remove Link"
          >
            <Unlink size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded-lg text-xs hover:bg-black/10 text-muted transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={14} />
        </button>

        <button
          type="button"
          onClick={insertTable}
          className="p-1.5 rounded-lg text-xs hover:bg-black/10 text-muted transition-colors"
          title="Insert Table"
        >
          <TableIcon size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-1.5 rounded-lg text-xs hover:bg-black/10 text-muted transition-colors"
          title="Clear formatting"
        >
          <RemoveFormatting size={14} />
        </button>

        <div className="h-4 w-[1px] bg-black/15 mx-1" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-xs disabled:opacity-30 hover:bg-black/10 text-muted transition-colors"
          title="Undo"
        >
          <Undo size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-xs disabled:opacity-30 hover:bg-black/10 text-muted transition-colors"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Word Count & Read Time Bar */}
      <div className="px-5 py-2.5 border-t border-border bg-[#faf8f2] flex items-center justify-between text-[11px] font-mono-label text-muted">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{textContent.length} characters</span>
        </div>
        <div>
          <span>~{readTimeMinutes} min read</span>
        </div>
      </div>
    </div>
  );
}
