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
