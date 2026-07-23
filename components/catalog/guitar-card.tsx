import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  applyDiscount,
  formatPrimaryPrice,
  formatSecondaryPrice,
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
    ? { usd: applyDiscount(guitar.price_usd, discount), uyu: applyDiscount(guitar.price_uyu, discount) }
    : original;

  const primaryPrice = formatPrimaryPrice(discounted);
  const secondaryPrice = formatSecondaryPrice(discounted);
  const originalPrimary = hasDiscount ? formatPrimaryPrice(original) : null;

  return (
    <Link href={`/catalogo/${guitar.slug}`} className="group block card-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-sm">
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
        {(isSold || isReserved) && (
          <div className="absolute left-3 top-3">
            <Badge variant={isSold ? "sold" : "reserved"}>{isSold ? "Vendida" : "Reservada"}</Badge>
          </div>
        )}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {hasDiscount && (
            <Badge variant="accent" className="font-bold tabular-nums">
              −{discount}%
            </Badge>
          )}
          {isNew && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              Recién llegada
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {guitar.year ? `${guitarTypeLabel(guitar.type)} · ${guitar.year}` : guitarTypeLabel(guitar.type)}
        </p>
        <h3 className="mt-1.5 font-serif text-xl leading-tight tracking-tight group-hover:text-accent transition-colors">
          {guitar.brand} <span className="text-muted-foreground">{guitar.model}</span>
        </h3>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <p className={cn("text-sm font-medium tabular-nums", hasDiscount && "text-accent")}>
            {primaryPrice}
          </p>
          {originalPrimary ? (
            <p className="text-xs text-muted-foreground line-through tabular-nums">{originalPrimary}</p>
          ) : null}
          {secondaryPrice && !originalPrimary ? (
            <p className="text-xs text-muted-foreground tabular-nums">{secondaryPrice}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
