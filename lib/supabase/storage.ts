const BUCKET = "guitars";
const BLOG_BUCKET = "blog-covers";

/**
 * Convierte un storage_path (relativo dentro del bucket) en URL pública.
 * Los objetos del bucket "guitars" son públicos para lectura.
 */
export function publicImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL faltante");
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

/** URL pública del bucket blog-covers (portadas de posts del blog). */
export function publicBlogImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL faltante");
  return `${base}/storage/v1/object/public/${BLOG_BUCKET}/${storagePath}`;
}

export const STORAGE_BUCKET = BUCKET;
export const BLOG_STORAGE_BUCKET = BLOG_BUCKET;
