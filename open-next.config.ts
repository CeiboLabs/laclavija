import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

/**
 * Config de OpenNext para Cloudflare. defineCloudflareConfig() maneja los
 * overrides específicos del adapter; el resto de opciones (buildCommand, etc.)
 * las mergeamos manualmente.
 *
 * incrementalCache: KV Namespace (binding NEXT_INC_CACHE_KV en wrangler.jsonc)
 * envuelto en withRegionalCache — writes a KV desde el Worker, reads con capa
 * de cache regional in-memory para latencia sub-10ms en hit local.
 *
 * Esto reemplaza al staticAssetsIncrementalCache read-only anterior. La
 * diferencia clave: KV es escribible desde el Worker en runtime, entonces
 * revalidatePath() y las paginas SSG con revalidate se actualizan solas.
 * Cuando se guarda una guitarra desde el admin (server action → revalidatePath),
 * las paginas afectadas se re-generan y se guardan en KV para el proximo request.
 *
 * Free tier de KV: 100k reads/dia, 1000 writes/dia, 1GB storage.
 */
const cf = defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, {
    mode: "long-lived",
  }),
});

export default {
  ...cf,
  // Bypass pnpm — invocar next build directo. pnpm 10.x + Node 25 rompe con
  // execSync (runDepsStatusCheck falla en subshell). En Cloudflare CI (Node 22)
  // no aplica pero el override es inocuo ahí.
  buildCommand: "./node_modules/.bin/next build",
};
