import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { BlogForm } from "@/components/admin/blog-form";
import { getAdminBlogPostById } from "@/lib/admin/queries";
import { updateBlogPostAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getAdminBlogPostById(id);
  if (!post) notFound();

  const boundAction = updateBlogPostAction.bind(null, id);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          Volver
        </Link>
        {post.published ? (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            Ver publicado
            <ExternalLink className="size-3" />
          </Link>
        ) : null}
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Editar post</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight mb-2 truncate">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Los cambios se reflejan en el sitio público en pocos segundos.
      </p>
      <BlogForm action={boundAction} initial={post} mode="edit" submitLabel="Guardar cambios" />
    </div>
  );
}
