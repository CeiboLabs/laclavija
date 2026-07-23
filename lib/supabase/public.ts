import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase sin cookies — para lecturas públicas (catálogo, detalle, etc.)
 * que respetan RLS pero no necesitan el contexto del usuario.
 * Se puede llamar en generateStaticParams, sitemap, RSC, etc.
 */
export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
