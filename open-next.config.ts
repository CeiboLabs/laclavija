import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Config de OpenNext para Cloudflare. defineCloudflareConfig() maneja los
 * overrides específicos del adapter; el resto de opciones (buildCommand, etc.)
 * las mergeamos manualmente.
 *
 * incrementalCache: si no se define un override, OpenNext usa el cache "dummy"
 * por default y las rutas SSG (/, /vender, /nosotros, /blog...) devuelven 500
 * porque nunca encuentra el prerender. staticAssets sirve las páginas
 * prerenderizadas desde los Cloudflare Workers Assets, read-only.
 */
const cf = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

export default {
  ...cf,
  // Bypass pnpm — invocar next build directo. pnpm 10.x + Node 25 rompe con
  // execSync (runDepsStatusCheck falla en subshell).
  buildCommand: "./node_modules/.bin/next build --debug-prerender",
};
