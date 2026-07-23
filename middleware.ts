import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";
const SESSION_COOKIE = "lc_session";
const SESSION_TTL_DAYS = 365;

function newSessionId() {
  // Edge runtime tiene crypto global.
  return crypto.randomUUID();
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Asegurar cookie de sesión anónima para tracking. La seteamos vía response
  // y no la propagamos a la request (no la necesita en este ciclo).
  if (!request.cookies.get(SESSION_COOKIE)) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: newSessionId(),
      maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refresca el JWT si es necesario. No remover.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const needsAuth = pathname.startsWith(PROTECTED_PREFIX) && pathname !== LOGIN_PATH;

  if (needsAuth && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === LOGIN_PATH) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
