import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Acceso",
  robots: { index: false, follow: false },
};

type Search = Record<string, string | string[] | undefined>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const redirectTo = typeof sp.redirectTo === "string" ? sp.redirectTo : "/admin";

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">La Clavija</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight">Panel</h1>
        </div>
        <LoginForm redirectTo={redirectTo} />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Los usuarios se gestionan desde el dashboard de Supabase
          <br />
          (Authentication → Users).
        </p>
      </div>
    </main>
  );
}
