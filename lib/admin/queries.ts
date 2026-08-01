import { createServerSupabase } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { Guitar, GuitarSpecs, GuitarStatus, GuitarType, ProductCategory } from "@/lib/types";

export type AdminGuitarFilters = {
  q?: string;
  category?: ProductCategory;
  type?: GuitarType;
  status?: GuitarStatus | "all";
  featured?: boolean;
};

type ImageRow = { id: string; storage_path: string; position: number };

export type AdminGuitarRow = Omit<Guitar, "images"> & {
  cover_url: string | null;
  images: { id: string; url: string; storage_path: string; position: number }[];
};

const SELECT = `
  id, slug, brand, model, year, category, type, price_usd, price_uyu, discount_percent, status, featured,
  short_description, long_description, specs, created_at,
  guitar_images ( id, storage_path, position )
`;

function mapRow(row: {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  category: ProductCategory | null;
  type: GuitarType | null;
  price_usd: number | null;
  price_uyu: number | null;
  discount_percent: number | null;
  status: GuitarStatus;
  featured: boolean;
  short_description: string;
  long_description: string;
  specs: GuitarSpecs;
  created_at: string;
  guitar_images: ImageRow[];
}): AdminGuitarRow {
  const images = [...(row.guitar_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({
      id: i.id,
      url: publicImageUrl(i.storage_path),
      storage_path: i.storage_path,
      position: i.position,
    }));
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    category: row.category ?? "guitar",
    type: row.type,
    price_usd: row.price_usd,
    price_uyu: row.price_uyu,
    discount_percent: row.discount_percent,
    status: row.status,
    featured: row.featured,
    short_description: row.short_description,
    long_description: row.long_description,
    specs: row.specs,
    created_at: row.created_at,
    cover_url: images[0]?.url ?? null,
    images,
  };
}

export async function listAdminGuitars(
  filters: AdminGuitarFilters = {},
): Promise<AdminGuitarRow[]> {
  const supabase = await createServerSupabase();
  let q = supabase.from("guitars").select(SELECT).order("created_at", { ascending: false });
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.type) q = q.eq("type", filters.type);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (typeof filters.featured === "boolean") q = q.eq("featured", filters.featured);
  if (filters.q) {
    const term = `%${filters.q.replace(/[%_]/g, "")}%`;
    q = q.or(`brand.ilike.${term},model.ilike.${term},slug.ilike.${term}`);
  }
  const { data, error } = await q;
  if (error) {
    console.error("[listAdminGuitars]", error.message);
    return [];
  }
  return (data as unknown as Parameters<typeof mapRow>[0][]).map(mapRow);
}

export async function getAdminGuitarById(id: string): Promise<AdminGuitarRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("guitars").select(SELECT).eq("id", id).maybeSingle();
  if (error) {
    console.error("[getAdminGuitarById]", error.message);
    return null;
  }
  if (!data) return null;
  return mapRow(data as unknown as Parameters<typeof mapRow>[0]);
}
