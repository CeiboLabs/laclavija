import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { BUSINESS, NAV_LINKS, whatsappLink } from "@/lib/constants";
import { getAllBrands, getRecentlySold } from "@/lib/queries";
import { brandToSlug } from "@/lib/brand-slug";
import { TYPE_SLUGS, SLUG_TO_LABEL } from "@/lib/type-slugs";
import { Marquee } from "@/components/decor/marquee";
import { Wordmark } from "@/components/brand/wordmark";

export async function Footer() {
  const [brands, sold] = await Promise.all([getAllBrands(), getRecentlySold(6)]);
  return (
    <footer className="mt-32 border-t border-border bg-background">
      {/* Marquee de recién vendidas */}
      {sold.length > 0 ? (
        <div className="border-b border-dashed border-border/60 bg-card/30">
          <Marquee ariaLabel="Guitarras recién vendidas">
            <span className="mono-meta text-accent">Recién vendidas</span>
            <span aria-hidden className="text-muted-foreground/50">·</span>
            {sold.map((g) => (
              <Link
                key={g.id}
                href={`/catalogo/${g.slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                <span className="line-through decoration-muted-foreground/40">
                  {g.brand} <span className="opacity-60">{g.model}</span>
                </span>
                <span aria-hidden className="text-muted-foreground/50">·</span>
              </Link>
            ))}
          </Marquee>
        </div>
      ) : null}

      <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="relative inline-block size-16 shrink-0 rounded-full overflow-hidden ring-1 ring-border">
              <Image
                src="/brand/la-clavija-logo.png"
                alt="La Clavija"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <Wordmark size="lg" />
              <span className="mono-meta text-[0.6rem] mt-2 opacity-70">Montevideo, Uruguay</span>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
            {BUSINESS.tagline}
          </p>
        </div>

        <div>
          <p className="mono-meta">Navegación</p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vendidas"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Vendidas
              </Link>
            </li>
          </ul>
        </div>

        {brands.length > 0 ? (
          <div>
            <p className="mono-meta">Marcas</p>
            <ul className="mt-4 space-y-2">
              {brands.slice(0, 8).map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/marca/${brandToSlug(brand)}`}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="mono-meta">Tipos</p>
            <ul className="mt-4 space-y-2">
              {TYPE_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/tipo/${slug}`}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {SLUG_TO_LABEL[slug]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="mono-meta">Contacto</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Instagram className="size-4" />
                Instagram
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {BUSINESS.city}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dashed border-border">
        <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="mono-meta text-[0.6rem]">
            © {new Date().getFullYear()} {BUSINESS.name} — Todos los derechos reservados
          </p>
          <p className="mono-meta text-[0.6rem]">Hecho en Montevideo</p>
        </div>
      </div>
    </footer>
  );
}
