"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editor Tiptap para el cuerpo de un post. Guarda HTML.
 * El campo hidden `name` va a formar parte del FormData del form padre.
 */
export function BlogEditor({
  name,
  initialHtml,
}: {
  name: string;
  initialHtml?: string;
}) {
  const [html, setHtml] = React.useState(initialHtml ?? "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image,
      Placeholder.configure({
        placeholder: "Escribí el cuerpo del post…",
      }),
    ],
    content: initialHtml ?? "",
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[420px] max-w-none px-4 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input bg-background">
      <Toolbar editor={editor} />
      <div className="border-t border-border">
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = React.useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImage = React.useCallback(() => {
    const url = window.prompt("URL de la imagen (ya subida)", "https://");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2">
      <TbBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Negrita">
        <BoldIcon className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Cursiva">
        <ItalicIcon className="size-3.5" />
      </TbBtn>
      <Sep />
      <TbBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Título 2">
        <Heading2 className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Título 3">
        <Heading3 className="size-3.5" />
      </TbBtn>
      <Sep />
      <TbBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Lista con viñetas">
        <List className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Lista numerada">
        <ListOrdered className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Cita">
        <Quote className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Divisor">
        <Minus className="size-3.5" />
      </TbBtn>
      <Sep />
      <TbBtn onClick={setLink} active={editor.isActive("link")} label="Enlace">
        <LinkIcon className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={insertImage} label="Insertar imagen por URL">
        <ImageIcon className="size-3.5" />
      </TbBtn>
      <Sep />
      <TbBtn onClick={() => editor.chain().focus().undo().run()} label="Deshacer" disabled={!editor.can().undo()}>
        <Undo2 className="size-3.5" />
      </TbBtn>
      <TbBtn onClick={() => editor.chain().focus().redo().run()} label="Rehacer" disabled={!editor.can().redo()}>
        <Redo2 className="size-3.5" />
      </TbBtn>
    </div>
  );
}

function TbBtn({
  children,
  onClick,
  active,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center justify-center rounded px-2 py-1.5 text-muted-foreground transition-colors",
        "hover:bg-secondary hover:text-foreground",
        "disabled:opacity-40 disabled:pointer-events-none",
        active && "bg-secondary text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-border" />;
}
