import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { BUSINESS, NAV_LINKS, whatsappLink } from "@/lib/constants";
import { getAllBrands } from "@/lib/queries";
import { brandToSlug } from "@/lib/brand-slug";
import { TYPE_SLUGS, SLUG_TO_LABEL } from "@/lib/type-slugs";

export async function Footer() {
  const brands = await getAllBrands();
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="inline-block overflow-hidden rounded-md ring-1 ring-border/40 shadow-lg">
            <Image
              src="/brand/la-clavija-logo.png"
              alt="La Clavija"
              width={1000}
              height={1000}
              className="block h-auto w-44"
              sizes="176px"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm text-muted-foreground leading-relaxed">{BUSINESS.tagline}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Navegación</p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/vendidas" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Vendidas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Tipos</p>
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

        {brands.length > 0 ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Marcas</p>
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
        ) : null}

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Contacto</p>
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
      <div className="border-t border-border">
        <div className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. Todos los derechos reservados.
          </p>
          <p>Hecho con cariño en Montevideo.</p>
        </div>
      </div>
    </footer>
  );
}
