import Image from "next/image";
import Link from "next/link";
import { Stamp } from "@/components/decor/stamp";
import {
  applyDiscount,
  categoryLabel,
  formatPrimaryPrice,
  guitarTypeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Guitar } from "@/lib/types";

interface GuitarCardProps {
  guitar: Guitar;
  priority?: boolean;
  sizes?: string;
}

const NEW_THRESHOLD_DAYS = 14;

function isRecentlyAdded(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return false;
  return Date.now() - created < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
}

export function GuitarCard({
  guitar,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: GuitarCardProps) {
  const isSold = guitar.status === "sold";
  const isReserved = guitar.status === "reserved";
  const isNew = !isSold && !isReserved && isRecentlyAdded(guitar.created_at);
  const cover = guitar.images[0];

  const discount = guitar.discount_percent;
  const hasDiscount = !isSold && typeof discount === "number" && discount > 0;

  const original = { usd: guitar.price_usd, uyu: guitar.price_uyu };
  const discounted = hasDiscount
    ? {
        usd: applyDiscount(guitar.price_usd, discount),
        uyu: applyDiscount(guitar.price_uyu, discount),
      }
    : original;

  const primaryPrice = formatPrimaryPrice(discounted);
  const originalPrimary = hasDiscount ? formatPrimaryPrice(original) : null;

  const typeLabel =
    guitar.category === "guitar" ? guitarTypeLabel(guitar.type) : categoryLabel(guitar.category);

  return (
    <Link href={`/catalogo/${guitar.slug}`} className="group block card-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-sm ring-1 ring-border/60">
        {cover ? (
          <Image
            src={cover}
            alt={`${guitar.brand} ${guitar.model}${guitar.year ? ` ${guitar.year}` : ""}`}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]",
              isSold && "opacity-60 grayscale",
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}

        {/* Solo un sello: prioridad estado > descuento > nuevo */}
        <div className="absolute right-3 top-3">
          {isSold ? (
            <Stamp variant="sold" size="md">
              Vendida
            </Stamp>
          ) : isReserved ? (
            <Stamp variant="reserved" size="md">
              Reservada
            </Stamp>
          ) : hasDiscount ? (
            <Stamp variant="new" size="sm">
              −{discount}%
            </Stamp>
          ) : isNew ? (
            <Stamp variant="new" size="sm">
              Recién llegada
            </Stamp>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <p className="mono-meta text-[0.6rem]">
          {typeLabel}
          {guitar.year ? ` · ${guitar.year}` : ""}
        </p>
        <h3 className="mt-1.5 font-serif text-xl leading-tight tracking-tight group-hover:text-accent transition-colors">
          {guitar.brand} <span className="text-muted-foreground">{guitar.model}</span>
        </h3>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap font-mono">
          <p
            className={cn(
              "text-sm tabular-nums",
              hasDiscount ? "text-accent font-medium" : "text-foreground",
            )}
          >
            {primaryPrice}
          </p>
          {originalPrimary ? (
            <p className="text-xs text-muted-foreground line-through tabular-nums">
              {originalPrimary}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
