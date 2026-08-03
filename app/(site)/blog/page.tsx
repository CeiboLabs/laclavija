import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { getPublishedBlogPosts } from "@/lib/queries";
import { cn } from "@/lib/utils";

// Dinamico — con staticAssetsIncrementalCache (read-only) en Cloudflare,
// las paginas SSG NO se pueden revalidar en runtime. Como el listado
// depende de la DB (nuevos posts publicados desde admin), corre en cada
// request contra Supabase (RTT ~50ms, aceptable).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notas, historias y guías sobre guitarras, amplificadores y compra-venta en Montevideo. Escritas desde La Clavija.",
  keywords: [
    "blog de guitarras",
    "notas sobre guitarras",
    "comprar guitarra usada Uruguay",
    "guitarra vintage Uruguay",
    "guitarras Montevideo",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog · La Clavija",
    description: "Notas, historias y guías desde La Clavija.",
    type: "website",
    url: "/blog",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogListPage() {
  const posts = await getPublishedBlogPosts(50);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 pt-16 md:pt-24 pb-24">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex items-center justify-between gap-6 mb-6">
            <p className="mono-meta text-accent">Blog</p>
            <p className="mono-meta hidden sm:block">
              {posts.length} {posts.length === 1 ? "nota" : "notas"}
            </p>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
            Notas y guías
            <span className="text-muted-foreground italic font-light"> desde La Clavija.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Reseñas, tips de compra, historias detrás de instrumentos que pasaron por acá.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="text-muted-foreground py-24 text-center">
            Todavía no hay posts publicados.
          </p>
        ) : (
          <RevealGroup stagger={0.06} className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <RevealItem key={p.id}>
                <BlogCard post={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>
    </>
  );
}

function BlogCard({
  post,
}: {
  post: Awaited<ReturnType<typeof getPublishedBlogPosts>>[number];
}) {
  const date = formatDate(post.published_at ?? post.created_at);
  return (
    <Link href={`/blog/${post.slug}`} className="group block card-lift">
      <article
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-secondary isolate",
          "ring-1 ring-border/70",
          "shadow-[0_4px_16px_-6px_rgba(0,0,0,0.5)]",
          "transition-[box-shadow,transform] duration-500",
          "group-hover:ring-accent/50",
          "group-hover:shadow-[0_18px_36px_-16px_rgba(0,0,0,0.65)]",
        )}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        )}

        {/* Gradient para legibilidad del texto sobre la portada */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />

        {/* Fecha en esquina superior — mismo tratamiento que un sello */}
        <div className="absolute left-4 top-4 z-10">
          <span className="mono-meta text-[0.6rem] text-accent bg-background/40 backdrop-blur-sm px-2 py-1 rounded-sm">
            {date}
          </span>
        </div>

        {/* Título + subtitle sobre la portada */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-10">
          <h2 className="font-serif text-xl md:text-2xl tracking-tight leading-[1.1] text-foreground group-hover:text-accent transition-colors">
            {post.title}
          </h2>
          {post.subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground italic font-light font-serif leading-snug line-clamp-2">
              {post.subtitle}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
