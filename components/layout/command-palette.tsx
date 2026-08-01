"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Guitar as GuitarIcon,
  Home,
  MessageCircle,
  Search,
  Tag,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { TYPE_SLUGS, SLUG_TO_LABEL } from "@/lib/type-slugs";
import { whatsappLink } from "@/lib/constants";

type SearchItem = {
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  type: string;
  price_uyu: number | null;
  image: string | null;
};

const PAGES: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Catálogo", href: "/catalogo", icon: Tag },
  { label: "Vender mi guitarra", href: "/vender", icon: GuitarIcon },
  { label: "Reparaciones", href: "/reparaciones", icon: Wrench },
  { label: "Nosotros", href: "/nosotros", icon: Home },
];

function priceLabel(uyu: number | null) {
  if (typeof uyu !== "number") return "Consultar";
  return `$U ${new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(uyu)}`;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<SearchItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open || items !== null || loading) return;
    setLoading(true);
    fetch("/api/search")
      .then((r) => r.json())
      .then((data: { items: SearchItem[] }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, items, loading]);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="hidden md:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="text-xs uppercase tracking-widest">Buscar</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="md:hidden"
      >
        <Search className="size-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar guitarras, marcas, páginas..." />
        <CommandList>
          <CommandEmpty>
            {loading ? "Cargando..." : "Sin resultados."}
          </CommandEmpty>

          <CommandGroup heading="Ir a">
            {PAGES.map((p) => (
              <CommandItem
                key={p.href}
                value={`pagina ${p.label}`}
                onSelect={() => go(p.href)}
              >
                <p.icon className="size-4 text-muted-foreground" />
                <span>{p.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tipos">
            {TYPE_SLUGS.map((slug) => (
              <CommandItem
                key={slug}
                value={`tipo ${SLUG_TO_LABEL[slug]}`}
                onSelect={() => go(`/tipo/${slug}`)}
              >
                <GuitarIcon className="size-4 text-muted-foreground" />
                <span>{SLUG_TO_LABEL[slug]}</span>
                <CommandShortcut>/tipo/{slug}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Acciones">
            <CommandItem
              value="whatsapp contacto"
              onSelect={() => {
                setOpen(false);
                window.open(whatsappLink(), "_blank", "noopener,noreferrer");
              }}
            >
              <MessageCircle className="size-4 text-accent" />
              <span>Escribir por WhatsApp</span>
            </CommandItem>
            <CommandItem
              value="tasar vender"
              onSelect={() => go("/vender")}
            >
              <Tag className="size-4 text-muted-foreground" />
              <span>Tasar mi guitarra</span>
            </CommandItem>
            <CommandItem
              value="reparar reparacion luthier"
              onSelect={() => go("/reparaciones")}
            >
              <Wrench className="size-4 text-muted-foreground" />
              <span>Pedir una reparación</span>
            </CommandItem>
          </CommandGroup>

          {items && items.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading={`Catálogo (${items.length})`}>
                {items.map((g) => (
                  <CommandItem
                    key={g.slug}
                    value={`${g.brand} ${g.model} ${g.year ?? ""}`}
                    onSelect={() => go(`/catalogo/${g.slug}`)}
                  >
                    {g.image ? (
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-sm bg-muted">
                        <Image
                          src={g.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-muted">
                        <GuitarIcon className="size-4 text-muted-foreground" />
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">
                        {g.brand} {g.model}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {g.year ? `${g.year} · ` : ""}
                        {priceLabel(g.price_uyu)}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
