"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { STORAGE_BUCKET } from "@/lib/supabase/storage";

// Compresion + WebP la hace el cliente (ver lib/image-compress.ts).
// El server solo valida tamaño y sube tal cual. Sharp no corre en Cloudflare Workers.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB después de compresión cliente

export type SavePromoState = { ok: boolean; error?: string };

export async function savePromoAction(
  _prev: SavePromoState | null,
  formData: FormData,
): Promise<SavePromoState> {
  const active = formData.get("active") === "on";
  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const ctaLabelRaw = String(formData.get("cta_label") ?? "").trim();
  const ctaUrlRaw = String(formData.get("cta_url") ?? "").trim();
  const expiresRaw = String(formData.get("expires_at") ?? "").trim();
  const removeImage = formData.get("remove_image") === "on";
  const imageFile = formData.get("image");
  const hasNewImage = imageFile instanceof File && imageFile.size > 0;

  if (active && !title && !message) {
    return { ok: false, error: "Si lo activás, al menos un título o mensaje." };
  }
  if (ctaUrlRaw && !ctaLabelRaw)
    return { ok: false, error: "Si poné link al CTA, también necesita un texto." };
  if (ctaLabelRaw && !ctaUrlRaw)
    return { ok: false, error: "Si poné texto al CTA, también necesita un link." };

  let expires_at: string | null = null;
  if (expiresRaw) {
    const d = new Date(expiresRaw);
    if (Number.isNaN(d.getTime())) return { ok: false, error: "Fecha de expiración inválida." };
    expires_at = d.toISOString();
  }

  const supabase = await createServerSupabase();

  // Necesitamos el image_path actual para borrar el viejo si se reemplaza o quita.
  const { data: current } = await supabase
    .from("promo_config")
    .select("image_path")
    .eq("id", 1)
    .maybeSingle();
  const oldImagePath = (current?.image_path as string | null) ?? null;

  let nextImagePath: string | null = oldImagePath;

  if (hasNewImage) {
    if (imageFile.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: `La imagen pesa más de ${MAX_UPLOAD_BYTES / 1024 / 1024}MB después de comprimir.` };
    }
    // Ya viene comprimida y en WebP desde el cliente. Solo subir.
    const ext = imageFile.name.split(".").pop()?.toLowerCase() || "webp";
    const path = `promo/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, imageFile, { contentType: imageFile.type || "image/webp", upsert: false });
    if (upErr) return { ok: false, error: upErr.message };
    nextImagePath = path;
  } else if (removeImage) {
    nextImagePath = null;
  }

  const { error } = await supabase
    .from("promo_config")
    .update({
      active,
      title,
      message,
      cta_label: ctaLabelRaw || null,
      cta_url: ctaUrlRaw || null,
      expires_at,
      image_path: nextImagePath,
    })
    .eq("id", 1);

  if (error) {
    // Si fallamos el update y subimos foto nueva, dejamos huérfana — limpiamos.
    if (hasNewImage && nextImagePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([nextImagePath]).catch(() => {});
    }
    return { ok: false, error: error.message };
  }

  // Update OK: si la foto vieja ya no se referencia, borrarla.
  if (oldImagePath && oldImagePath !== nextImagePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([oldImagePath]).catch(() => {});
  }

  // El modal vive en el layout público — refrescamos todo el árbol.
  revalidatePath("/", "layout");
  return { ok: true };
}
