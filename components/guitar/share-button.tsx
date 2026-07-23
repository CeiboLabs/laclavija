"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Share2 } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import type { Guitar } from "@/lib/types";

function buildShareUrl(guitar: Guitar) {
  return `${SITE_URL}/catalogo/${guitar.slug}`;
}

function buildShareText(guitar: Guitar) {
  const name = guitar.year
    ? `${guitar.brand} ${guitar.model} ${guitar.year}`
    : `${guitar.brand} ${guitar.model}`;
  return `Mirá esta ${name} en La Clavija`;
}

export function ShareButton({ guitar }: { guitar: Guitar }) {
  const [copied, setCopied] = React.useState(false);

  async function handleClick() {
    const url = buildShareUrl(guitar);
    const text = buildShareText(guitar);
    track("share_guitar", { slug: guitar.slug });

    // 1) Web Share API nativo (mobile / Safari / Chrome moderno).
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: text, text, url });
        return;
      } catch (err) {
        // El usuario canceló o falló. Caemos al fallback solo si fallo real.
        if ((err as Error).name === "AbortError") return;
      }
    }

    // 2) Fallback desktop: copiamos el link al clipboard + toast.
    try {
      await navigator.clipboard.writeText(`${text}: ${url}`);
      setCopied(true);
      toast.success("Link copiado. Pegalo donde quieras.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 3) Ultima opcion: abrir WhatsApp con el mensaje. Sin numero — el
      //    usuario elige a quien mandarselo.
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleClick}
      className="w-full sm:w-auto"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link copiado" : "Compartir"}
    </Button>
  );
}
