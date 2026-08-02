"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { BLOG_STORAGE_BUCKET } from "@/lib/supabase/storage";
import { MAX_BLOG_COVER_BYTES, processBlogCover } from "@/lib/admin/image-process";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function revalidatePublic(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export type SaveBlogPostState = { ok: boolean; error?: string; id?: string };

type BlogFields = {
  title: string;
  subtitle: string | null;
  content: string;
  slug: string;
  published: boolean;
};

function readFields(formData: FormData): BlogFields | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) return { error: "El título es obligatorio." };
  if (title.length > 200) return { error: "El título es demasiado largo (máx 200)." };
  if (!content || content === "<p></p>") return { error: "El contenido no puede estar vacío." };

  const slug = slugInput ? slugify(slugInput) : slugify(title);
  if (!slug) return { error: "No se pudo generar el slug." };

  return {
    title,
    subtitle: subtitle || null,
    content,
    slug,
    published,
  };
}

async function uploadCoverIfPresent(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  slug: string,
  cover: FormDataEntryValue | null,
): Promise<{ path: string | null; error?: string }> {
  if (!(cover instanceof File) || cover.size === 0) return { path: null };
  if (cover.size > MAX_BLOG_COVER_BYTES)
    return { path: null, error: `La portada pesa más de ${MAX_BLOG_COVER_BYTES / 1024 / 1024}MB.` };

  // Procesar: auto-orient EXIF, resize a 1920 max, convertir a WebP con quality 82.
  let processed;
  try {
    const buf = Buffer.from(await cover.arrayBuffer());
    processed = await processBlogCover(buf);
  } catch (err) {
    return { path: null, error: `No se pudo procesar la portada: ${(err as Error).message}` };
  }

  const path = `${slug}/cover-${Date.now()}.${processed.ext}`;
  const { error } = await supabase.storage
    .from(BLOG_STORAGE_BUCKET)
    .upload(path, processed.buffer, { contentType: processed.contentType, upsert: false });
  if (error) return { path: null, error: error.message };
  return { path };
}

export async function createBlogPostAction(
  _prev: SaveBlogPostState | null,
  formData: FormData,
): Promise<SaveBlogPostState> {
  const parsed = readFields(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createServerSupabase();

  const cover = formData.get("cover");
  const uploaded = await uploadCoverIfPresent(supabase, parsed.slug, cover);
  if (uploaded.error) return { ok: false, error: uploaded.error };

  const insertPayload: Record<string, unknown> = {
    slug: parsed.slug,
    title: parsed.title,
    subtitle: parsed.subtitle,
    content: parsed.content,
    published: parsed.published,
    cover_image_path: uploaded.path,
  };
  if (parsed.published) insertPayload.published_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(insertPayload)
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un post con ese slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/blog");
  revalidatePublic(data.slug as string);
  redirect("/admin/blog?created=1");
}

export async function updateBlogPostAction(
  id: string,
  _prev: SaveBlogPostState | null,
  formData: FormData,
): Promise<SaveBlogPostState> {
  const parsed = readFields(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createServerSupabase();

  // Estado previo para saber si published cambió y para mantener/reemplazar cover
  const { data: previous } = await supabase
    .from("blog_posts")
    .select("published, cover_image_path")
    .eq("id", id)
    .maybeSingle();

  const cover = formData.get("cover");
  const removeCover = formData.get("remove_cover") === "on";

  let coverPath: string | null | undefined = undefined; // undefined = no cambiar
  if (removeCover) {
    if (previous?.cover_image_path) {
      await supabase.storage.from(BLOG_STORAGE_BUCKET).remove([previous.cover_image_path as string]);
    }
    coverPath = null;
  } else if (cover instanceof File && cover.size > 0) {
    // Subir nueva y borrar la vieja si existía
    if (previous?.cover_image_path) {
      await supabase.storage.from(BLOG_STORAGE_BUCKET).remove([previous.cover_image_path as string]);
    }
    const uploaded = await uploadCoverIfPresent(supabase, parsed.slug, cover);
    if (uploaded.error) return { ok: false, error: uploaded.error };
    coverPath = uploaded.path;
  }

  const updatePayload: Record<string, unknown> = {
    slug: parsed.slug,
    title: parsed.title,
    subtitle: parsed.subtitle,
    content: parsed.content,
    published: parsed.published,
  };
  if (coverPath !== undefined) updatePayload.cover_image_path = coverPath;
  // published_at: setear la primera vez que se publica
  if (parsed.published && !previous?.published) {
    updatePayload.published_at = new Date().toISOString();
  }
  // Si se despublica, mantengo published_at (histórico); no lo borro.

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updatePayload)
    .eq("id", id)
    .select("id, slug")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un post con ese slug." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePublic(data.slug as string);
  redirect("/admin/blog?saved=1");
}

export async function deleteBlogPostAction(id: string): Promise<void> {
  const supabase = await createServerSupabase();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("slug, cover_image_path")
    .eq("id", id)
    .maybeSingle();

  if (post?.cover_image_path) {
    await supabase.storage.from(BLOG_STORAGE_BUCKET).remove([post.cover_image_path as string]);
  }

  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/admin/blog");
  revalidatePublic(post?.slug as string | undefined);
  redirect("/admin/blog");
}

export async function togglePublishedAction(id: string, published: boolean) {
  const supabase = await createServerSupabase();
  const payload: Record<string, unknown> = { published };
  if (published) payload.published_at = new Date().toISOString();

  const { data } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select("slug")
    .single();

  revalidatePath("/admin/blog");
  revalidatePublic(data?.slug as string | undefined);
}
