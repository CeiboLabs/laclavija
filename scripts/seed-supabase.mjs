// Sube las 10 guitarras del array TS local a Supabase (filas + imágenes a Storage).
// Uso:
//   pnpm seed
//
// Idempotente: si una guitarra con el mismo slug ya existe, la salta.
// Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local (bypassea RLS).

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { config as loadEnv } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
loadEnv({ path: resolve(ROOT, ".env.local") });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(URL, SERVICE, { auth: { persistSession: false } });

const { GUITARS } = await import(resolve(ROOT, "lib/data/guitars.ts").replace(/\\/g, "/"))
  .catch(async () => {
    // tsx no disponible: leer y eval el array no es viable. Mejor convertir a JSON intermedio.
    const src = await readFile(resolve(ROOT, "lib/data/guitars.ts"), "utf8");
    // Extracción muy simple: encuentra el array exportado y lo evalúa via Function.
    const match = src.match(/export const GUITARS[^=]*=\s*(\[[\s\S]*\]);?\s*$/m);
    if (!match) throw new Error("No pude parsear lib/data/guitars.ts");
    return { GUITARS: Function(`"use strict";return (${match[1]});`)() };
  });

console.log(`Sembrando ${GUITARS.length} guitarras…`);

let inserted = 0;
let skipped = 0;

for (const g of GUITARS) {
  const { data: existing } = await supabase
    .from("guitars")
    .select("id")
    .eq("slug", g.slug)
    .maybeSingle();

  if (existing) {
    console.log(`  · ${g.slug} — ya existe, salto`);
    skipped++;
    continue;
  }

  // Insertar la guitarra
  const { data: guitar, error: gErr } = await supabase
    .from("guitars")
    .insert({
      slug: g.slug,
      brand: g.brand,
      model: g.model,
      year: g.year,
      type: g.type,
      price_usd: g.price_usd,
      status: g.status,
      featured: g.featured,
      short_description: g.short_description,
      long_description: g.long_description,
      specs: g.specs,
      created_at: g.created_at,
    })
    .select("id")
    .single();

  if (gErr) {
    console.error(`  ✗ ${g.slug} — error: ${gErr.message}`);
    continue;
  }

  // Subir imágenes
  for (let i = 0; i < g.images.length; i++) {
    const localPath = g.images[i]; // ej "/guitars/strat-sunburst.jpg" o "/decor/playing-dark.png"
    const fileName = basename(localPath);
    const storagePath = `${g.slug}/${i}-${fileName}`;

    const filePath = resolve(ROOT, "public", localPath.replace(/^\//, ""));
    let fileBuffer;
    try {
      fileBuffer = await readFile(filePath);
    } catch {
      console.warn(`    ! foto no encontrada localmente: ${localPath}`);
      continue;
    }

    const contentType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

    const { error: uErr } = await supabase.storage
      .from("guitars")
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (uErr) {
      console.error(`    ✗ upload ${storagePath}: ${uErr.message}`);
      continue;
    }

    const { error: iErr } = await supabase.from("guitar_images").insert({
      guitar_id: guitar.id,
      storage_path: storagePath,
      position: i,
    });
    if (iErr) {
      console.error(`    ✗ registro imagen: ${iErr.message}`);
    }
  }

  console.log(`  ✓ ${g.slug}`);
  inserted++;
}

console.log(`\nListo. Insertadas: ${inserted}, salteadas: ${skipped}.`);
