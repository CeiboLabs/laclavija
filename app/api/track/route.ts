import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SESSION_COOKIE = "lc_session";
const ALLOWED_KINDS = new Set(["view", "wa_click"]);

export async function POST(request: NextRequest) {
  let body: { guitarId?: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const guitarId = body?.guitarId;
  const kind = body?.kind;
  if (typeof guitarId !== "string" || guitarId.length < 8)
    return NextResponse.json({ ok: false }, { status: 400 });
  if (typeof kind !== "string" || !ALLOWED_KINDS.has(kind))
    return NextResponse.json({ ok: false }, { status: 400 });

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { error } = await supabase
    .from("guitar_events")
    .insert({ guitar_id: guitarId, kind, session_id: sessionId });

  if (error) {
    console.error("[track]", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
