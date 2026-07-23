// Genera los favicons a partir de la ilustración del clavijero ya recortada.
// Uso: node scripts/make-favicon.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "public/brand/favicon-source.png");
const ICON_DIR = resolve(ROOT, "app");

await mkdir(ICON_DIR, { recursive: true });

// La fuente ya viene cuadrada (1254×1254), con el peg centrado y fondo crema
// con esquinas redondeadas estilo app icon. No hace falta recortar, sólo escalar.
function iconBuffer(targetSize) {
  return sharp(SRC).resize(targetSize, targetSize, { fit: "cover" }).png();
}

// 1) icon.png — 512x512 para uso general (también fallback de Open Graph)
await iconBuffer(512).toFile(resolve(ICON_DIR, "icon.png"));

// 2) apple-icon.png — 180x180 (iOS home screen aplica su propia máscara encima)
await iconBuffer(180).toFile(resolve(ICON_DIR, "apple-icon.png"));

// 3) favicon.ico — multi-resolución (16, 32, 48) para máxima compatibilidad
const sizes = [16, 32, 48];
const pngBuffers = await Promise.all(sizes.map((s) => iconBuffer(s).toBuffer()));
const icoBuffer = await pngToIco(pngBuffers);
await writeFile(resolve(ICON_DIR, "favicon.ico"), icoBuffer);

console.log("OK — generados:");
console.log("  · app/icon.png        (512×512)");
console.log("  · app/apple-icon.png  (180×180)");
console.log("  · app/favicon.ico     (16/32/48)");
