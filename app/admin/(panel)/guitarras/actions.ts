"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { STORAGE_BUCKET } from "@/lib/supabase/storage";
// Compresion + WebP la hace el cliente (ver lib/image-compress.ts).
// El server solo valida tamaño y sube tal cual. Sharp no corre en Cloudflare Workers.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB después de compresión cliente
import type { GuitarSpecs, GuitarStatus, GuitarType, ProductCategory } from "@/lib/types";

const TYPES: GuitarType[] = ["electric", "acoustic", "classical", "bass"];
const STATUSES: GuitarStatus[] = ["available", "reserved", "sold"];
const CATEGORIES: ProductCategory[] = ["guitar", "amp", "accessory"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  if (slug) revalidatePath(`/catalogo/${slug}`);
}

export type SaveGuitarState = { ok: boolean; error?: string; id?: string };

type GuitarFields = {
  brand: string;
  model: string;
  year: number | null;
  category: ProductCategory;
  type: GuitarType | null;
  price_usd: number | null;
  price_uyu: number | null;
  discount_percent: number | null;
  status: GuitarStatus;
  featured: boolean;
  short_description: string;
  long_description: string;
  specs: GuitarSpecs;
  slug: string;
};

function readFields(formData: FormData): GuitarFields | { error: string } {
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const yearStr = String(formData.get("year") ?? "").trim();
  const yearUnknown = formData.get("year_unknown") === "on";
  const categoryRaw = String(formData.get("category") ?? "guitar") as ProductCategory;
  const category: ProductCategory = CATEGORIES.includes(categoryRaw) ? categoryRaw : "guitar";
  const typeRaw = String(formData.get("type") ?? "").trim();
  const priceUsdStr = String(formData.get("price_usd") ?? "").trim();
  const priceUyuStr = String(formData.get("price_uyu") ?? "").trim();
  const discountStr = String(formData.get("discount_percent") ?? "").trim();
  const status = (String(formData.get("status") ?? "available") as GuitarStatus) || "available";
  const featured = formData.get("featured") === "on";
  const short_description = String(formData.get("short_description") ?? "").trim();
  const long_description = String(formData.get("long_description") ?? "").trim();
  const specsRaw = String(formData.get("specs") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!brand || !model) return { error: "Marca y modelo son obligatorios." };

  let year: number | null = null;
  if (!yearUnknown && yearStr) {
    const parsed = Number.parseInt(yearStr, 10);
    if (!Number.isFinite(parsed) || parsed < 1900 || parsed > 2100)
      return { error: "Año inválido." };
    year = parsed;
  }

  let type: GuitarType | null = null;
  if (category === "guitar") {
    if (!TYPES.includes(typeRaw as GuitarType)) return { error: "Tipo inválido." };
    type = typeRaw as GuitarType;
  }

  let price_usd: number | null = null;
  if (priceUsdStr) {
    const parsed = Number.parseInt(priceUsdStr, 10);
    if (!Number.isFinite(parsed) || parsed < 0) return { error: "Precio USD inválido." };
    price_usd = parsed;
  }
  let price_uyu: number | null = null;
  if (priceUyuStr) {
    const parsed = Number.parseInt(priceUyuStr, 10);
    if (!Number.isFinite(parsed) || parsed < 0) return { error: "Precio UYU inválido." };
    price_uyu = parsed;
  }
  if (price_uyu === null) {
    // UYU es lo que se muestra. Si queda vacio, en el sitio aparece "Consultar".
    // Lo permitimos igual (algunas piezas pueden ir a consultar precio).
  }

  let discount_percent: number | null = null;
  if (discountStr) {
    const parsed = Number.parseInt(discountStr, 10);
    if (!Number.isFinite(parsed)) return { error: "Descuento inválido." };
    if (parsed < 0 || parsed > 99) return { error: "Descuento tiene que estar entre 0 y 99." };
    discount_percent = parsed > 0 ? parsed : null;
  }

  if (!STATUSES.includes(status)) return { error: "Estado inválido." };

  let specs: GuitarSpecs = {};
  if (specsRaw) {
    try {
      const parsed = JSON.parse(specsRaw);
      if (typeof parsed !== "object" || Array.isArray(parsed))
        return { error: "Specs debe ser un objeto JSON." };
      specs = parsed as GuitarSpecs;
    } catch {
      return { error: "Specs no es JSON válido." };
    }
  }

  const slugBase = year !== null ? `${brand} ${model} ${year}` : `${brand} ${model}`;
  const slug = slugInput ? slugify(slugInput) : slugify(slugBase);
  if (!slug) return { error: "No se pudo generar el slug." };

  return {
    brand,
    model,
    year,
    category,
    type,
    price_usd,
    price_uyu,
    discount_percent,
    status,
    featured,
    short_description,
    long_description,
    specs,
    slug,
  };
}

/**
 * Procesa con sharp + sube al bucket + inserta en guitar_images.
 * Devuelve { ok } o un error stringeado por imagen. No tira: ese path es
 * "best effort" para que una foto que falla no rompa toda la creación.
 */
async function uploadProcessedImage(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  guitarId: string,
  slug: string,
  file: File,
  position: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `"${file.name}" pesa más de ${MAX_UPLOAD_BYTES / 1024 / 1024}MB después de comprimir.` };
  }
  // Ya viene comprimida y en WebP desde el cliente. Solo subir.
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `${slug}/${position}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type || "image/webp", upsert: false });
  if (upErr) return { ok: false, error: upErr.message };

  const { error: insErr } = await supabase
    .from("guitar_images")
    .insert({ guitar_id: guitarId, storage_path: path, position });
  if (insErr) return { ok: false, error: insErr.message };

  return { ok: true };
}

export async function createGuitarAction(
  _prev: SaveGuitarState | null,
  formData: FormData,
): Promise<SaveGuitarState> {
  const parsed = readFields(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .insert(parsed)
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe una guitarra con ese slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/guitarras");
  revalidatePublic(data.slug);
  redirect(`/admin/guitarras/${data.id}?created=1`);
}

export async function updateGuitarAction(
  id: string,
  _prev: SaveGuitarState | null,
  formData: FormData,
): Promise<SaveGuitarState> {
  const parsed = readFields(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .update(parsed)
    .eq("id", id)
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe una guitarra con ese slug." };
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/guitarras");
  revalidatePath(`/admin/guitarras/${id}`);
  revalidatePublic(data.slug);
  return { ok: true, id: data.id };
}

export async function deleteGuitarAction(id: string): Promise<void> {
  const supabase = await createServerSupabase();

  const { data: imgs } = await supabase
    .from("guitar_images")
    .select("storage_path")
    .eq("guitar_id", id);

  const paths = (imgs ?? []).map((i) => i.storage_path as string);
  if (paths.length) {
    await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  }

  const { data: g } = await supabase
    .from("guitars")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("guitars").delete().eq("id", id);

  revalidatePath("/admin/guitarras");
  revalidatePublic(g?.slug as string | undefined);
  redirect("/admin/guitarras");
}

export async function setStatusAction(id: string, status: GuitarStatus) {
  if (!STATUSES.includes(status)) return;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("guitars")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .single();
  revalidatePath("/admin/guitarras");
  revalidatePublic(data?.slug as string | undefined);
}

export async function setFeaturedAction(id: string, featured: boolean) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("guitars")
    .update({ featured })
    .eq("id", id)
    .select("slug")
    .single();
  revalidatePath("/admin/guitarras");
  revalidatePublic(data?.slug as string | undefined);
}

// ============================================================
// Imágenes (upload suelto post-creación)
// ============================================================
export type ImageActionState = { ok: boolean; error?: string };

export async function uploadGuitarImageAction(
  guitarId: string,
  _prev: ImageActionState | null,
  formData: FormData,
): Promise<ImageActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "No se eligió archivo." };

  const supabase = await createServerSupabase();

  const { data: g } = await supabase
    .from("guitars")
    .select("slug")
    .eq("id", guitarId)
    .maybeSingle();
  if (!g) return { ok: false, error: "Guitarra no encontrada." };

  const { data: existing } = await supabase
    .from("guitar_images")
    .select("position")
    .eq("guitar_id", guitarId)
    .order("position", { ascending: false })
    .limit(1);
  const nextPos = (existing?.[0]?.position ?? -1) + 1;

  const res = await uploadProcessedImage(supabase, guitarId, g.slug as string, file, nextPos);
  if (!res.ok) return { ok: false, error: res.error };

  revalidatePath(`/admin/guitarras/${guitarId}`);
  revalidatePublic(g.slug as string);
  return { ok: true };
}

export async function deleteGuitarImageAction(imageId: string, guitarId: string) {
  const supabase = await createServerSupabase();
  const { data: img } = await supabase
    .from("guitar_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();
  if (img?.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([img.storage_path as string]);
  }
  await supabase.from("guitar_images").delete().eq("id", imageId);

  const { data: g } = await supabase
    .from("guitars")
    .select("slug")
    .eq("id", guitarId)
    .maybeSingle();
  revalidatePath(`/admin/guitarras/${guitarId}`);
  revalidatePublic(g?.slug as string | undefined);
}

export async function setImagePositionAction(
  imageId: string,
  guitarId: string,
  position: number,
) {
  if (!Number.isFinite(position) || position < 0) return;
  const supabase = await createServerSupabase();
  await supabase.from("guitar_images").update({ position }).eq("id", imageId);
  const { data: g } = await supabase
    .from("guitars")
    .select("slug")
    .eq("id", guitarId)
    .maybeSingle();
  revalidatePath(`/admin/guitarras/${guitarId}`);
  revalidatePublic(g?.slug as string | undefined);
}

// ============================================================
// Bulk: aplicar / quitar descuento a un conjunto de guitarras
// ============================================================
export type BulkResult = { ok: boolean; updated: number; error?: string };

export async function setDiscountBulkAction(
  ids: string[],
  percent: number | null,
): Promise<BulkResult> {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { ok: false, updated: 0, error: "No hay guitarras seleccionadas." };
  }
  if (percent !== null) {
    if (!Number.isFinite(percent) || percent < 1 || percent > 99) {
      return { ok: false, updated: 0, error: "Descuento tiene que estar entre 1 y 99 (o vacio para quitar)." };
    }
  }
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .update({ discount_percent: percent })
    .in("id", ids)
    .select("slug");
  if (error) return { ok: false, updated: 0, error: error.message };

  revalidatePath("/admin/guitarras");
  revalidatePath("/catalogo");
  revalidatePath("/");
  for (const row of data ?? []) {
    if (row?.slug) revalidatePath(`/catalogo/${row.slug as string}`);
  }
  return { ok: true, updated: data?.length ?? 0 };
}

// ============================================================
// Duplicar guitarra (sin fotos). Redirige a la pagina de edicion.
// ============================================================
export async function duplicateGuitarAction(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { data: src, error: srcErr } = await supabase
    .from("guitars")
    .select(
      "brand, model, year, category, type, price_usd, price_uyu, discount_percent, status, short_description, long_description, specs, slug",
    )
    .eq("id", id)
    .single();
  if (srcErr || !src) throw new Error(srcErr?.message ?? "Guitarra origen no encontrada.");

  // Slug nuevo: agregamos sufijo timestampeado para evitar colision unique.
  // El usuario lo va a poder editar desde el form.
  const baseSlug = String(src.slug ?? "duplicado");
  const newSlug = `${baseSlug}-copia-${Date.now().toString(36)}`.slice(0, 100);

  const { data: created, error: insErr } = await supabase
    .from("guitars")
    .insert({
      brand: src.brand,
      model: src.model,
      year: src.year,
      category: src.category,
      type: src.type,
      price_usd: src.price_usd,
      price_uyu: src.price_uyu,
      discount_percent: src.discount_percent,
      status: "available",
      featured: false,
      short_description: src.short_description,
      long_description: src.long_description,
      specs: src.specs,
      slug: newSlug,
    })
    .select("id")
    .single();
  if (insErr) throw new Error(insErr.message);

  revalidatePath("/admin/guitarras");
  redirect(`/admin/guitarras/${created.id}?duplicated=1`);
}
