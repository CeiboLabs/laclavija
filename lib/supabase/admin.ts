import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — BYPASSEA RLS. Sólo usar server-side para
 * tareas administrativas (invitar usuarios, listar emails, etc.).
 * NUNCA exponer al navegador.
 */
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars faltantes (server)");
  return createClient(url, key, { auth: { persistSession: false } });
}
