import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/blog-form";
import { createBlogPostAction } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="size-3" />
        Volver
      </Link>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Nuevo post</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight mb-2">Crear</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Cargá título, portada y contenido. Se guarda como borrador por defecto — activá el toggle para publicar.
      </p>
      <BlogForm action={createBlogPostAction} mode="create" submitLabel="Crear post" />
    </div>
  );
}
