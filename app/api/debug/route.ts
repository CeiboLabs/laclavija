import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/public";

/**
 * Endpoint temporal para debug — verifica env vars Y prueba conexión Supabase.
 * Borrar después de resolver el 500.
 */
export async function GET() {
  const mask = (v: string | undefined) => {
    if (!v) return { present: false, value: null };
    return { present: true, value: `${v.slice(0, 12)}...${v.slice(-4)} (len=${v.length})` };
  };

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: mask(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    NEXT_PUBLIC_SITE_URL: mask(process.env.NEXT_PUBLIC_SITE_URL),
    NEXT_PUBLIC_WHATSAPP_NUMBER: mask(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  // Test 1: instanciar cliente Supabase
  let clientCheck: { ok: boolean; error?: string } = { ok: false };
  try {
    createPublicSupabase();
    clientCheck = { ok: true };
  } catch (err) {
    clientCheck = { ok: false, error: (err as Error).message };
  }

  // Test 2: hacer una query real a la DB
  let queryCheck: { ok: boolean; error?: string; sample?: unknown } = { ok: false };
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase.from("guitars").select("id, slug").limit(1);
    if (error) {
      queryCheck = { ok: false, error: `Supabase error: ${error.message}` };
    } else {
      queryCheck = { ok: true, sample: data };
    }
  } catch (err) {
    queryCheck = { ok: false, error: `Throw: ${(err as Error).message}` };
  }

  // Test 3: fetch crudo a Supabase (por si el problema es a nivel network)
  let fetchCheck: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(`${url}/rest/v1/guitars?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    fetchCheck = { ok: res.ok, status: res.status };
  } catch (err) {
    fetchCheck = { ok: false, error: (err as Error).message };
  }

  return NextResponse.json({
    env,
    clientCheck,
    queryCheck,
    fetchCheck,
    now: new Date().toISOString(),
  });
}
