import type { ImageLoaderProps } from "next/image";

/**
 * Loader custom de next/image. En vez de bajar el original al server para
 * optimizarlo (lo que en dev/mobile se cuelga con timeout), delega el resize:
 *
 * - Supabase Storage: sirve la URL pública cruda. (El render endpoint es feature
 *   de plan Pro y este proyecto esta en Free — devuelve FeatureNotEnabled.)
 * - Unsplash: usa sus query params de resize.
 * - Resto (locales en public/, ya pre-optimizados): se sirve tal cual.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const q = quality ?? 75;

  if (src.includes("/storage/v1/object/public/")) {
    // Sin transformación: anexamos width como hint de cache. El endpoint
    // ignora el query, pero hace que el browser/CDN cacheen por tamaño.
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}w=${width}`;
  }

  if (src.includes("images.unsplash.com")) {
    const u = new URL(src);
    u.searchParams.set("w", String(width));
    u.searchParams.set("q", String(q));
    u.searchParams.set("auto", "format");
    return u.toString();
  }

  // Locales (public/): ya estan pre-optimizadas a WebP, no hay forma de
  // resizearlas server-side con loader custom. Anexamos width como query
  // para satisfacer la validacion de Next y para que el browser cachee por
  // tamaño. El handler de assets estaticos ignora el query.
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}`;
}
