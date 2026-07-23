import { createServerSupabase } from "@/lib/supabase/server";

export type SiteStats = {
  total_views: number;
  total_unique_views: number;
  total_wa_clicks: number;
};

export type GuitarStatRow = {
  guitar_id: string;
  views: number;
  unique_views: number;
  wa_clicks: number;
};

export async function getSiteStats(days = 30): Promise<SiteStats> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc("site_stats", { days });
  if (error) {
    console.error("[getSiteStats]", error.message);
    return { total_views: 0, total_unique_views: 0, total_wa_clicks: 0 };
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { total_views: 0, total_unique_views: 0, total_wa_clicks: 0 };
  return {
    total_views: Number(row.total_views ?? 0),
    total_unique_views: Number(row.total_unique_views ?? 0),
    total_wa_clicks: Number(row.total_wa_clicks ?? 0),
  };
}

export async function getGuitarStats(days = 30): Promise<Map<string, GuitarStatRow>> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc("guitar_stats", { days });
  const map = new Map<string, GuitarStatRow>();
  if (error || !data) {
    if (error) console.error("[getGuitarStats]", error.message);
    return map;
  }
  for (const row of data as GuitarStatRow[]) {
    map.set(row.guitar_id, {
      guitar_id: row.guitar_id,
      views: Number(row.views ?? 0),
      unique_views: Number(row.unique_views ?? 0),
      wa_clicks: Number(row.wa_clicks ?? 0),
    });
  }
  return map;
}
