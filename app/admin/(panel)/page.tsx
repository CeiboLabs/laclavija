import Link from "next/link";
import { ArrowRight, BarChart3, Guitar, Megaphone } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSiteStats } from "@/lib/admin/stats";

async function getStats() {
  const supabase = await createServerSupabase();
  const [total, available, sold, reserved, featured] = await Promise.all([
    supabase.from("guitars").select("*", { count: "exact", head: true }),
    supabase
      .from("guitars")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),
    supabase.from("guitars").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase
      .from("guitars")
      .select("*", { count: "exact", head: true })
      .eq("status", "reserved"),
    supabase.from("guitars").select("*", { count: "exact", head: true }).eq("featured", true),
  ]);

  const { data: promo } = await supabase
    .from("promo_config")
    .select("active, title")
    .eq("id", 1)
    .maybeSingle();

  return {
    total: total.count ?? 0,
    available: available.count ?? 0,
    sold: sold.count ?? 0,
    reserved: reserved.count ?? 0,
    featured: featured.count ?? 0,
    promo: promo as { active: boolean; title: string } | null,
  };
}

const cards = [
  {
    href: "/admin/guitarras",
    title: "Guitarras",
    description: "Publicar, editar, cambiar estado y subir fotos.",
    icon: Guitar,
  },
  {
    href: "/admin/promo",
    title: "Promo modal",
    description: "Editar y activar el pop-up de promo del sitio.",
    icon: Megaphone,
  },
  {
    href: "/admin/estadisticas",
    title: "Estadísticas",
    description: "Vistas y clicks de WhatsApp por guitarra.",
    icon: BarChart3,
  },
];

export default async function AdminHome() {
  const [stats, siteStats] = await Promise.all([getStats(), getSiteStats(30)]);
  const conversion =
    siteStats.total_unique_views > 0
      ? Math.round((siteStats.total_wa_clicks / siteStats.total_unique_views) * 100)
      : 0;

  return (
    <div className="px-4 sm:px-8 py-12 max-w-5xl">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Resumen</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Hola.</h1>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Disponibles" value={stats.available} accent />
        <Stat label="Reservadas" value={stats.reserved} />
        <Stat label="Vendidas" value={stats.sold} muted />
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Destacadas" value={stats.featured} />
        <div className="col-span-2 sm:col-span-3 rounded-md border border-border bg-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Promo modal</p>
            <p className="mt-1 text-sm">
              {stats.promo?.active ? (
                <>
                  <span className="text-accent">Activo</span> · {stats.promo.title || "sin título"}
                </>
              ) : (
                <span className="text-muted-foreground">Inactivo</span>
              )}
            </p>
          </div>
          <Link
            href="/admin/promo"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            Editar <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between gap-3 mb-4">
        <h2 className="font-serif text-2xl tracking-tight">Últimos 30 días</h2>
        <Link
          href="/admin/estadisticas"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          Ver detalle <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Vistas" value={siteStats.total_views} />
        <Stat label="Visitantes únicos" value={siteStats.total_unique_views} accent />
        <Stat label="Clicks a WhatsApp" value={siteStats.total_wa_clicks} />
        <div className="rounded-md border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Conversión</p>
          <p className="mt-1 font-serif text-3xl tracking-tight">{conversion}%</p>
          <p className="text-xs text-muted-foreground">clicks ÷ únicos</p>
        </div>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-md border border-border bg-card p-5 hover:border-accent transition-colors"
            >
              <Icon className="size-5 text-accent" />
              <p className="mt-3 font-serif text-lg tracking-tight">{c.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: number;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-serif text-3xl tracking-tight ${
          accent ? "text-accent" : muted ? "text-muted-foreground" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
