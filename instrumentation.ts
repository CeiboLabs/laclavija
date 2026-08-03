/**
 * Next.js instrumentation hook — captura errores server-side crudos.
 * Se ejecuta en el runtime, antes que Next enmascare el mensaje.
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register() {
  // Nada que inicializar por ahora
}

export const onRequestError: (
  error: unknown,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string },
) => void | Promise<void> = (error, request, context) => {
  const err = error as Error;
  console.error("[onRequestError] Crudo:", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack?.split("\n").slice(0, 20).join("\n"),
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
