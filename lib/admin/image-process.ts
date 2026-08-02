import sharp from "sharp";

/**
 * Pipeline de optimización para fotos del catálogo:
 *  - Auto-orient según EXIF
 *  - Resize a max 1600px de ancho (sin agrandar si la original es chica)
 *  - Convierte todo a WebP con calidad 85
 *  - Strip de metadata (más liviano)
 */
export async function processGuitarImage(
  input: Buffer | Uint8Array | ArrayBuffer,
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const buffer = await sharp(input as Buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  return { buffer, contentType: "image/webp", ext: "webp" };
}

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB raw — después se comprime

/**
 * Pipeline para portadas de posts del blog.
 * Se sirven full-width en el hero del detalle y en aspect 16:10 en el listado,
 * así que apuntamos a un ancho más generoso que las fotos del catálogo.
 */
export async function processBlogCover(
  input: Buffer | Uint8Array | ArrayBuffer,
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const buffer = await sharp(input as Buffer)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return { buffer, contentType: "image/webp", ext: "webp" };
}

export const MAX_BLOG_COVER_BYTES = 8 * 1024 * 1024; // 8MB raw — después se comprime
