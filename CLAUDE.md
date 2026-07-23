# La Clavija — guía para Claude

Web de marketing/catálogo para un negocio de compra, venta y permuta de guitarras en Montevideo. **No es e-commerce**: muestra stock, transmite credibilidad y empuja a contactar por WhatsApp o coordinar visita al taller.

## Stack

- **Next.js 15** App Router, **React 19**, **TypeScript** estricto (`noUncheckedIndexedAccess` activo)
- **Tailwind CSS v4** con tokens OKLCH en `app/globals.css` (dark only — el modo claro fue removido)
- **shadcn/ui escrito a mano** sobre Radix (en `components/ui/`) — sin CLI, importable
- **framer-motion**, **lucide-react** (peso de stroke bajado globalmente a 1.25 vía CSS)
- **next/font**: Inter (sans) + Fraunces (serif, eje óptico activo)
- Sin tests por ahora. Sin Storybook.

## Datos

**No hay base de datos.** Esto es una demo standalone:

- El catálogo vive en `lib/data/guitars.ts` como array TS hardcodeado
- Las queries en `lib/queries.ts` son **funciones síncronas** que filtran/buscan ese array
- Las fotos son archivos en `public/guitars/` (catálogo) y `public/decor/` (decoración)
- El form de `/vender` usa un Server Action que **sólo loguea en consola** — buscar el `// TODO` en `app/vender/actions.ts` cuando haya que conectar email/DB/CRM real

Si en algún momento el usuario quiere conectar a Supabase u otra DB: reemplazar las funciones síncronas de `lib/queries.ts` por equivalentes async. El resto del código no debería cambiar (todos los consumers ya usan async-friendly o se adaptan trivialmente).

## Branding

- Nombre: **La Clavija**. Significado: clavija = peg del clavijero de la guitarra
- Datos del negocio centralizados en `lib/constants.ts` (`BUSINESS` + helper `whatsappLink(message?)`)
- Logo: `public/brand/la-clavija-logo.png` (1254×1254, fondo crema `#F0E8DA`)
- Wordmark tipográfico: `components/brand/wordmark.tsx` (replica "La" chico + "Clavija" grande en Fraunces). Header lo usa con `size="md"`, mobile sheet con `size="lg" stacked`
- Favicons: `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` (Next 15 los detecta automáticamente). Se regeneran con `node scripts/make-favicon.mjs` — el script recorta el clavijero de la PNG del logo con sharp
- Acento del sitio: `oklch(0.74 0.09 85)` (dorado/cobre tipo clavijero envejecido) — rima con el crema del logo
- Placeholders activos: `BUSINESS.whatsappNumber` = `59899999999`, email `hola@laclavija.uy`, location en Pocitos (lat/lng). Reemplazar cuando haya datos reales

## Convenciones

- **Filtros del catálogo viven en la URL** (`searchParams`), no en estado de cliente. Parser en `lib/filters.ts`. Esto da SSR + back/forward + URLs compartibles
- **Imágenes**: siempre `next/image`. `priority` sólo en la primera imagen above-the-fold. `sizes` apropiado a cada layout
- **Animaciones**: limitadas a `components/motion/reveal.tsx` (fade-in al entrar al viewport) y micro-transitions de hover. Nada de scroll-snap, parallax, gradientes saturados o efectos tipo Awwwards
- **Íconos**: lucide-react. El CSS global aplica `stroke-width: 1.25` a `svg.lucide` para look fino editorial. No hace falta pasar `strokeWidth` en cada uso
- **Sin emojis** en la UI. Si necesitás un símbolo, usá un ícono lucide
- **Server Components por defecto**. Client sólo donde haya estado, framer-motion, o event handlers
- **Imports**: `@/*` apunta a la raíz del proyecto

## Lo que NO incluye (a propósito)

- Carrito, checkout, pasarela de pago
- Login de usuarios
- Newsletter, popups, chatbot flotante
- Base de datos
- Animaciones exageradas

## Workflow con el usuario

- Habla en **español rioplatense informal**. Mantener ese registro
- Para tareas largas de scaffolding, una vez establecido el plan general, prefiere **autonomía**: no gatear cada decisión. Cuando dice "hace todo vos", "no me detengas más", "dale para adelante" → comprometerse a defaults plausibles, no preguntar por detalles chicos
- Para cambios destructivos (borrar archivos, renombrar carpetas, force-push) sí confirmar

## Comandos útiles

```bash
pnpm dev               # dev server
pnpm build             # build de prod
pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint

node scripts/make-favicon.mjs   # regenerar favicons desde el logo
```

## Páginas y rutas

- `/` — home (hero + featured + how-we-work + atmosphere strips + sell CTA + testimonios)
- `/catalogo` — grid filtrado, dinámico
- `/catalogo/[slug]` — detalle, prerenderizado (SSG)
- `/vender` — explicación + formulario
- `/nosotros` — editorial + galería + mapa
- `/robots.txt`, `/sitemap.xml` — autogenerados
