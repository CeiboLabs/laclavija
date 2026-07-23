"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Guitar } from "@/lib/types";

function buildMessage(guitar: Guitar) {
  const label = guitar.year
    ? `${guitar.brand} ${guitar.model} ${guitar.year}`
    : `${guitar.brand} ${guitar.model}`;
  return `Hola, me interesa la ${label} que vi en la web.`;
}

function trackWaClick(guitarId: string) {
  if (typeof navigator === "undefined") return;
  const url = "/api/track";
  const payload = JSON.stringify({ guitarId, kind: "wa_click" });
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function WhatsAppCta({ guitar }: { guitar: Guitar }) {
  if (guitar.status === "sold") {
    return (
      <div className="rounded-md border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        Esta guitarra ya se vendió. Si te interesa algo similar, mandanos un mensaje y vemos qué tenemos en stock.
      </div>
    );
  }
  return (
    <Button asChild size="lg" variant="accent" className="flex-1 group/wa">
      <a
        href={whatsappLink(buildMessage(guitar))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWaClick(guitar.id)}
      >
        <span className="relative inline-flex">
          <MessageCircle className="size-4" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-accent-foreground/60 animate-soft-ping pointer-events-none"
          />
        </span>
        Consultar por WhatsApp
      </a>
    </Button>
  );
}

export function StickyWhatsAppCta({ guitar }: { guitar: Guitar }) {
  if (guitar.status === "sold") return null;
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.4 }}
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto max-w-md flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {guitar.brand} {guitar.model}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPrice({ usd: guitar.price_usd, uyu: guitar.price_uyu })}
          </p>
        </div>
        <Button asChild size="default" variant="accent" className="shrink-0">
          <a
            href={whatsappLink(buildMessage(guitar))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWaClick(guitar.id)}
          >
            <span className="relative inline-flex">
              <MessageCircle className="size-4" />
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-accent-foreground/60 animate-soft-ping pointer-events-none"
              />
            </span>
            Consultar
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
