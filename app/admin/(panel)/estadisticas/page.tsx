import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { listAdminGuitars } from "@/lib/admin/queries";
import { getGuitarStats, getSiteStats } from "@/lib/admin/stats";
import { formatPrice, guitarTypeLabel } from "@/lib/format";

type Search = Record<string, string | string[] | undefined>;

const RANGES = [
  { days: 7, label: "7 días" },
  { days: 30, label: "30 días" },
  { days: 90, label: "90 días" },
  { days: 365, label: "1 año" },
] as const;

const SORT_OPTIONS = ["views", "wa_clicks", "conv"] as const;
type Sort = (typeof SORT_OPTIONS)[number];

function parseRange(sp: Search): number {
  const raw = typeof sp.range === "string" ? Number.parseInt(sp.range, 10) : 30;
  return RANGES.some((r) => r.days === raw) ? raw : 30;
}

function parseSort(sp: Search): Sort {
  const v = typeof sp.sort === "string" ? sp.sort : "views";
  return (SORT_OPTIONS as readonly string[]).includes(v) ? (v as Sort) : "views";
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const days = parseRange(sp);
  const sort = parseSort(sp);

  const [site, statsMap, guitars] = await Promise.all([
    getSiteStats(days),
    getGuitarStats(days),
    listAdminGuitars(),
  ]);

  const conversion =
    site.total_unique_views > 0
      ? Math.round((site.total_wa_clicks / site.total_unique_views) * 100)
      : 0;

  const rows = guitars.map((g) => {
    const s = statsMap.get(g.id) ?? { views: 0, unique_views: 0, wa_clicks: 0 };
    const conv = s.unique_views > 0 ? (s.wa_clicks / s.unique_views) * 100 : 0;
    return { guitar: g, ...s, conv };
  });

  rows.sort((a, b) => {
    if (sort === "views") return b.unique_views - a.unique_views || b.views - a.views;
    if (sort === "wa_clicks") return b.wa_clicks - a.wa_clicks;
    return b.conv - a.conv;
  });

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Tracking</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Estadísticas</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        Vistas únicas (un visitante = una vista) y clicks al CTA de WhatsApp. La conversión es el
        ratio entre clicks y visitantes únicos.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/admin/estadisticas?range=${r.days}${sort !== "views" ? `&sort=${sort}` : ""}`}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              days === r.days
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Vistas" value={site.total_views} />
        <StatCard label="Visitantes únicos" value={site.total_unique_views} accent />
        <StatCard label="Clicks a WhatsApp" value={site.total_wa_clicks} />
        <StatCard label="Conversión" value={`${conversion}%`} />
      </div>

      <h2 className="mt-12 font-serif text-2xl tracking-tight mb-4">Por guitarra</h2>

      <div className="rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <div className="col-span-5">Guitarra</div>
          <SortHeader sort={sort} days={days} field="views" className="col-span-2 text-right">
            Vistas
          </SortHeader>
          <SortHeader sort={sort} days={days} field="wa_clicks" className="col-span-2 text-right">
            WhatsApp
          </SortHeader>
          <SortHeader sort={sort} days={days} field="conv" className="col-span-2 text-right">
            Conversión
          </SortHeader>
          <div className="col-span-1" />
        </div>
        <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <span>Ordenar:</span>
          <SortHeader sort={sort} days={days} field="views">Vistas</SortHeader>
          <SortHeader sort={sort} days={days} field="wa_clicks">WA</SortHeader>
          <SortHeader sort={sort} days={days} field="conv">Conv.</SortHeader>
        </div>
        {rows.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No hay datos todavía. Las stats aparecen cuando entran visitantes al sitio.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map(({ guitar: g, views, unique_views, wa_clicks, conv }) => (
              <li
                key={g.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 md:items-center hover:bg-secondary/40 transition-colors"
              >
                <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-secondary">
                    {g.cover_url ? (
                      <Image src={g.cover_url} alt="" fill sizes="48px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/guitarras/${g.id}`}
                      className="block text-sm font-medium truncate hover:text-accent transition-colors"
                    >
                      {g.brand} {g.model}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {guitarTypeLabel(g.type)} · {formatPrice({ usd: g.price_usd, uyu: g.price_uyu })}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 md:text-right tabular-nums flex md:block items-center gap-1.5">
                  <span className="md:hidden text-xs uppercase tracking-widest text-muted-foreground w-16">Vistas</span>
                  <span className="text-sm">{unique_views}</span>
                  {views !== unique_views ? (
                    <span className="text-xs text-muted-foreground ml-1">({views})</span>
                  ) : null}
                </div>
                <div className="md:col-span-2 md:text-right tabular-nums flex md:block items-center gap-1.5">
                  <span className="md:hidden text-xs uppercase tracking-widest text-muted-foreground w-16">WhatsApp</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-sm",
                      wa_clicks > 0 ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    {wa_clicks > 0 ? <MessageCircle className="size-3" /> : null}
                    {wa_clicks}
                  </span>
                </div>
                <div className="md:col-span-2 md:text-right tabular-nums text-sm flex md:block items-center gap-1.5">
                  <span className="md:hidden text-xs uppercase tracking-widest text-muted-foreground w-16">Conv.</span>
                  {unique_views > 0 ? `${Math.round(conv)}%` : "—"}
                </div>
                <div className="md:col-span-1 md:text-right">
                  <Link
                    href={`/catalogo/${g.slug}`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Ver →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Las vistas únicas se cuentan por sesión (cookie del visitante). El número en paréntesis es
        el total de vistas incluyendo refreshes.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-serif text-3xl tracking-tight tabular-nums",
          accent && "text-accent",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function SortHeader({
  sort,
  days,
  field,
  className,
  children,
}: {
  sort: Sort;
  days: number;
  field: Sort;
  className?: string;
  children: React.ReactNode;
}) {
  const active = sort === field;
  return (
    <Link
      href={`/admin/estadisticas?range=${days}&sort=${field}`}
      className={cn(
        "inline-flex items-center justify-end gap-1 hover:text-foreground transition-colors",
        active && "text-foreground",
        className,
      )}
    >
      {children}
      {active ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3 opacity-30" />}
    </Link>
  );
}
