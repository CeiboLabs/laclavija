import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listAdminBlogPosts } from "@/lib/admin/queries";
import { PublishToggle, DeletePostButton } from "@/components/admin/blog-row-controls";
import { PostCreatedToast } from "@/components/admin/blog-created-toast";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const posts = await listAdminBlogPosts();

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl">
      {sp.created ? <PostCreatedToast kind="created" /> : sp.saved ? <PostCreatedToast kind="saved" /> : null}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Blog</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight">Posts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/blog/nuevo">
            <Plus className="size-4" />
            Nuevo post
          </Link>
        </Button>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <div className="col-span-6">Post</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-3">Fecha</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>
        {posts.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No hay posts todavía. Empezá con <Link href="/admin/blog/nuevo" className="text-accent hover:underline">Nuevo post</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 md:items-center hover:bg-secondary/40 transition-colors"
              >
                <div className="md:col-span-6 flex items-center gap-3 min-w-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title} fill sizes="64px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="block font-medium truncate hover:text-accent transition-colors"
                    >
                      {p.title}
                    </Link>
                    {p.subtitle ? (
                      <p className="text-xs text-muted-foreground truncate">{p.subtitle}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground truncate">/{p.slug}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <PublishToggle id={p.id} value={p.published} />
                </div>
                <div className="md:col-span-3 text-xs text-muted-foreground">
                  {p.published_at
                    ? `Pub. ${new Date(p.published_at).toLocaleDateString("es-UY")}`
                    : `Creado ${new Date(p.created_at).toLocaleDateString("es-UY")}`}
                </div>
                <div className="md:col-span-1 flex md:justify-end items-center gap-1">
                  <DeletePostButton id={p.id} title={p.title} />
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/blog/${p.id}`}>
                      <Pencil className="size-3.5" />
                      <span className="md:hidden">Editar</span>
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="size-3.5 text-accent" /> publicado
        <span className="mx-2">·</span>
        <EyeOff className="size-3.5" /> borrador
      </div>
    </div>
  );
}
