import { NextResponse } from "next/server";

/**
 * Endpoint temporal para verificar env vars en runtime en Cloudflare Workers.
 * Devuelve status de cada var sin exponer el valor completo. Borrar después de debug.
 */
export async function GET() {
  const mask = (v: string | undefined) => {
    if (!v) return { present: false, value: null };
    return { present: true, value: `${v.slice(0, 12)}...${v.slice(-4)} (len=${v.length})` };
  };

  return NextResponse.json({
    runtime: {
      NEXT_PUBLIC_SUPABASE_URL: mask(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      NEXT_PUBLIC_SITE_URL: mask(process.env.NEXT_PUBLIC_SITE_URL),
      NEXT_PUBLIC_WHATSAPP_NUMBER: mask(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
      SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    now: new Date().toISOString(),
  });
}
