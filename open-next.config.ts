import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Config de OpenNext para Cloudflare. Los defaults son suficientes para este
 * sitio: SSR + Server Actions + revalidatePath, todo corre en un Worker.
 *
 * No usamos cache incremental (ISR) porque el catálogo es dinámico contra
 * Supabase y el revalidate por-path se dispara desde los server actions.
 */
export default defineCloudflareConfig({});
