import imageCompression from "browser-image-compression";

/**
 * Prepara una imagen en el browser antes de enviarla al server.
 *
 * Politica: preservar el original tal cual (formato + calidad) para no degradar
 * fotos que ya vienen editadas. Solo intervenimos si son excesivamente grandes:
 * se redimensiona al maximo del preset manteniendo el formato de entrada
 * (JPEG queda JPEG, PNG queda PNG). No hay conversion a WebP.
 *
 * Sharp no corre en Cloudflare Workers, por eso todo el trabajo pasa por el
 * browser con browser-image-compression (que usa un web worker).
 */
export type CompressPreset = "cover" | "product";

const PRESETS: Record<CompressPreset, { maxWidthOrHeight: number }> = {
  // Portadas de blog — hero full-width, permitimos un poco mas ancho
  cover: { maxWidthOrHeight: 3200 },
  // Fotos de guitarras — 3000px es suficiente para zoom en detalle en retina
  product: { maxWidthOrHeight: 3000 },
};

async function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return dims;
  } catch {
    return null;
  }
}

export async function compressImage(
  file: File,
  preset: CompressPreset = "cover",
): Promise<File> {
  const { maxWidthOrHeight } = PRESETS[preset];

  const dims = await readDimensions(file);
  const longestSide = dims ? Math.max(dims.width, dims.height) : Infinity;

  // Caso feliz: la foto ya tiene un tamaño razonable → la subimos intacta.
  // No hay re-encoding, se preserva 100% la calidad del original.
  if (longestSide <= maxWidthOrHeight) return file;

  // Solo redimensionamos, forzando que el output mantenga el mime type original.
  const fileType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const resized = await imageCompression(file, {
    maxWidthOrHeight,
    useWebWorker: true,
    fileType,
    initialQuality: 0.92,
    preserveExif: false,
    alwaysKeepResolution: false,
  });

  return new File([resized], file.name, { type: fileType });
}
