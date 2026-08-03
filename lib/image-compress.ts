import imageCompression from "browser-image-compression";

/**
 * Comprime una imagen en el browser antes de enviarla al server.
 *
 * Reemplaza el pipeline server-side de sharp (que no corre en Cloudflare Workers).
 * Corre en un web worker interno, no bloquea el UI, y devuelve un File listo para
 * mandar dentro de un FormData.
 *
 * Los defaults están pensados para fotos editoriales del sitio:
 *  - maxWidth 1920px (lado más largo)
 *  - target WebP quality alta
 *  - target size ~500KB (upper bound; salidas típicas 100-300KB)
 */
export type CompressPreset = "cover" | "product";

const PRESETS: Record<CompressPreset, { maxWidthOrHeight: number; maxSizeMB: number }> = {
  // Portadas de blog — más ancho para hero full-width
  cover: { maxWidthOrHeight: 1920, maxSizeMB: 0.6 },
  // Fotos de guitarras — un poco más chicas, en el catálogo se muestran hasta ~800px
  product: { maxWidthOrHeight: 1600, maxSizeMB: 0.5 },
};

export async function compressImage(
  file: File,
  preset: CompressPreset = "cover",
): Promise<File> {
  // Si ya es un WebP y pesa poco, no gastamos ciclos en re-comprimir.
  if (file.type === "image/webp" && file.size < 400 * 1024) return file;

  const opts = PRESETS[preset];
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: opts.maxWidthOrHeight,
    maxSizeMB: opts.maxSizeMB,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.82,
    // Preserva EXIF orientation al aplicarla y la strippea
    preserveExif: false,
    alwaysKeepResolution: false,
  });

  // Renombrar con extensión .webp para que sea coherente
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([compressed], `${baseName}.webp`, { type: "image/webp" });
}
