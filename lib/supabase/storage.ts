const BUCKET = "guitars";

/**
 * Convierte un storage_path (relativo dentro del bucket) en URL pública.
 * Los objetos del bucket "guitars" son públicos para lectura.
 */
export function publicImageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL faltante");
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

export const STORAGE_BUCKET = BUCKET;
