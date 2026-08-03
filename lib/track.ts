/**
 * Tracker de eventos custom.
 *
 * Cuando el sitio corría en Vercel usábamos `@vercel/analytics#track()` para
 * eventos como "wa_click", "share_clicked", "sell_form_submit". Ahora en
 * Cloudflare Web Analytics no hay API de eventos custom — solo pageviews.
 *
 * Este helper queda como no-op para no perder los call sites. Si más adelante
 * querés eventos custom podés enchufar Plausible, Umami o un endpoint propio
 * acá adentro sin tocar los componentes que ya llaman `track()`.
 */
export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    console.log("[track]", event, data);
  }
  // TODO: enchufar tracker real (Plausible / Umami / endpoint propio).
}
