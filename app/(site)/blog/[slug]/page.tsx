import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostSchema, breadcrumbSchema } from "@/lib/seo";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post no encontrado" };

  const description =
    post.subtitle?.trim() ||
    post.content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const date = formatDate(post.published_at ?? post.created_at);

  return (
    <>
      <JsonLd
        data={[
          blogPostSchema(post),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="pt-16 md:pt-24 pb-24">
        <div className="container-prose px-5 sm:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="size-3" />
            Volver al blog
          </Link>

          <p className="mono-meta text-accent">{date}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-tight leading-[1.05]">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="mt-5 font-serif text-xl md:text-2xl italic font-light text-muted-foreground leading-snug">
              {post.subtitle}
            </p>
          ) : null}
        </div>

        {post.cover_image_url ? (
          <div className="mt-12 md:mt-16 mx-auto max-w-5xl px-5 sm:px-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm ring-1 ring-border/60 bg-secondary">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="container-prose px-5 sm:px-8 mt-12 md:mt-16">
          <div
            className="prose-post"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="container-prose px-5 sm:px-8 mt-16 pt-8 border-t border-dashed border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-3" />
            Más notas del blog
          </Link>
        </div>
      </article>
    </>
  );
}
