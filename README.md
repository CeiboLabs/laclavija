# La Clavija — Compra y venta de guitarras

Sitio de marketing/catálogo para un negocio de compra, venta y permuta de guitarras en Montevideo. **No es un e-commerce**: muestra stock, transmite credibilidad y empuja a contacto por WhatsApp o visita al taller.

Esta versión es **standalone**: los datos del catálogo se cargan desde un archivo local (`lib/data/guitars.ts`) y las fotos viven en `public/`. No necesita base de datos para correr.

## Stack

- **Next.js 15** (App Router, Server Components por defecto)
- **React 19** + **TypeScript** estricto (`noUncheckedIndexedAccess` activo)
- **Tailwind CSS v4** con design tokens en OKLCH + shadcn/ui escrito a mano sobre Radix
- **framer-motion**, **lucide-react**, **next-themes**
- **Vercel** para deploy

## Estructura

```
app/
├── layout.tsx               # root con fonts (Inter + Fraunces), ThemeProvider, Header, Footer
├── page.tsx                 # home
├── catalogo/
│   ├── page.tsx             # grid con filtros vía URL searchParams
│   └── [slug]/page.tsx      # detalle, generateStaticParams + generateMetadata
├── vender/
│   ├── page.tsx             # explicación + formulario
│   └── actions.ts           # server action (registra en logs, lista para conectar a un backend)
├── nosotros/page.tsx        # editorial + Google Maps embed + galería de taller
├── not-found.tsx            # 404 con tono editorial
├── sitemap.ts / robots.ts   # SEO
└── globals.css              # tokens Tailwind v4 + utilidades

components/
├── ui/                      # shadcn primitives (button, badge, card, sheet, dialog, select, input, label, textarea)
├── layout/                  # header (sticky/blur), footer, theme-toggle
├── home/                    # hero, featured-grid, how-we-work, sell-cta, testimonials
├── catalog/                 # guitar-card, filter-form/sidebar/sheet, active-filters, guitar-grid, catalog-banner
├── guitar/                  # gallery (lightbox), specs, whatsapp-cta (+ sticky mobile), similar
├── sell/                    # process-steps, sell-form (useActionState + useFormStatus)
├── decor/                   # atmosphere-strip (imagen full-bleed con cita opcional)
└── motion/                  # reveal (fade-in en scroll)

lib/
├── constants.ts             # datos del negocio + whatsappLink()
├── format.ts                # formatUsd, labels
├── filters.ts               # parseo y conteo de filtros del catálogo
├── queries.ts               # funciones de lectura sobre el dataset local
├── types.ts                 # tipos Guitar, GuitarSpecs, etc.
├── utils.ts                 # cn()
└── data/
    └── guitars.ts           # ← el catálogo. Editá este archivo para agregar/quitar guitarras.

public/
├── decor/                   # fotos atmosféricas usadas como decoración
└── guitars/                 # fotos del catálogo
```

## Setup local

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Abrir <http://localhost:3000>. No hay paso de DB ni de seed: las 10 guitarras de muestra ya están cargadas en `lib/data/guitars.ts`.

### Variables de entorno

| Variable | Qué es |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número con código de país, sin `+` ni espacios (ej `59899123456`) |
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, OG) |

## Cómo agregar una guitarra

1. Copiar las fotos a `public/guitars/` (formato JPG o PNG, idealmente 4:5 o 4:3)
2. Abrir `lib/data/guitars.ts` y agregar una entrada al array `GUITARS`:

```ts
{
  id: "g-11",                                      // único, lo que sea
  slug: "fender-mustang-1972",                     // va a la URL: /catalogo/<slug>
  brand: "Fender",
  model: "Mustang",
  year: 1972,
  type: "electric",                                // electric | acoustic | classical | bass
  price_usd: 1850,
  status: "available",                             // available | reserved | sold
  featured: true,                                  // si true, aparece en la home
  short_description: "Resumen corto para tarjetas.",
  long_description: "Historia larga.\n\nPárrafos separados por dos saltos de línea.",
  specs: {
    body_wood: "Aliso",
    pickups: "2x Single-coil",
    // ...los que apliquen
    accessories: ["Estuche", "Cable"],
  },
  images: ["/guitars/mi-foto-1.jpg", "/guitars/mi-foto-2.jpg"],
  created_at: "2026-05-25T00:00:00Z",              // afecta el orden en el catálogo
}
```

3. Listo. `pnpm dev` ya muestra el cambio. Build estático regenera la página del slug.

## Scripts

| Comando | Para qué |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Levantar el build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint (next/core-web-vitals + next/typescript) |

## Deploy en Vercel

1. Conectar el repo en Vercel
2. Cargar las dos env vars (`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`)
3. Deploy

Como todas las páginas son estáticas (excepto `/catalogo` que usa `searchParams` para filtros), el sitio se sirve desde el CDN sin compute por request.

## Formulario de venta

El form en `/vender` está conectado a un **server action de demo** que sólo valida y loguea la consulta en el server. Cuando lo quieras conectar a un backend real (email, DB, CRM, hoja de cálculo, etc.), editá `app/vender/actions.ts` — está marcado el lugar exacto con `// TODO`.

## Decisiones de diseño

- **Dark por defecto**, light disponible. Tokens OKLCH en `globals.css` con acento `oklch(0.74 0.09 85)` que es un dorado/cobre tipo clavijero envejecido.
- **Fuentes**: Inter para body y UI, Fraunces (con eje óptico) para títulos y citas. Le da el aire editorial que buscábamos.
- **Filtros del catálogo** viven en la URL (no en estado de cliente). Esto da SSR + back/forward + URLs compartibles gratis.
- **Imágenes**: todas con `next/image`, prioridad sólo en la primera de cada vista, `sizes` apropiado para cada layout.
- **Animaciones**: solo fade-in sutil al scroll (`components/motion/reveal.tsx`) y micro-transitions de hover. Nada de scroll-snap, parallax ni efectos de Awwwards.
- **WhatsApp**: el número vive en `lib/constants.ts` con override por env var. El helper `whatsappLink(message?)` arma `https://wa.me/...?text=...` con encoding correcto.
- **Decoración**: hay un componente `AtmosphereStrip` que renderiza imagen full-bleed con cita opcional. Se usa entre secciones para romper la grilla de tarjetas con momentos editoriales.

## Lo que NO incluye (a propósito)

- Carrito, checkout, pasarela de pago
- Login de usuarios
- Newsletter, popups, chatbot flotante
- Base de datos (este build se carga desde un array local; cuando lo necesites, conectás Supabase u otra DB sin tocar el resto)
