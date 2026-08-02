import { BUSINESS, SITE_URL } from "./constants";
import { applyDiscount, categoryLabel, guitarTypeLabel } from "./format";
import type { Guitar } from "./types";

/** @id estable del negocio, referenciable desde otros nodos (offers.seller, etc). */
export const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/brand/logo-512.webp`;

/** Telefono en formato E.164 a partir del numero de WhatsApp (sin + ni espacios). */
function telephone(): string {
  return `+${BUSINESS.whatsappNumber}`;
}

/**
 * MusicStore (subtipo de LocalBusiness). El negocio no tiene local fisico:
 * se modela con areaServed (Montevideo + Uruguay) y sin streetAddress.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    image: LOGO_URL,
    logo: LOGO_URL,
    telephone: telephone(),
    priceRange: "$$",
    currenciesAccepted: "UYU, USD",
    paymentAccepted: "Efectivo (UYU y USD), Transferencia bancaria",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.country,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    sameAs: [BUSINESS.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BUSINESS.name,
    description: BUSINESS.tagline,
    inLanguage: "es-UY",
    publisher: { "@id": BUSINESS_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/catalogo?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function availabilityFor(status: Guitar["status"]): string {
  switch (status) {
    case "available":
      return "https://schema.org/InStock";
    case "reserved":
      return "https://schema.org/LimitedAvailability";
    case "sold":
      return "https://schema.org/SoldOut";
    default:
      return "https://schema.org/InStock";
  }
}

export function productSchema(guitar: Guitar) {
  const name = guitar.year
    ? `${guitar.brand} ${guitar.model} ${guitar.year}`
    : `${guitar.brand} ${guitar.model}`;
  const url = `${SITE_URL}/catalogo/${guitar.slug}`;

  // Solo UYU en el offer publico. Aunque en DB pueda haber price_usd, no lo
  // exponemos en structured data para mantener consistencia con lo que se ve.
  const discount = guitar.discount_percent;
  const finalUyu = applyDiscount(guitar.price_uyu, discount);
  const offer = typeof finalUyu === "number" ? { price: finalUyu, currency: "UYU" } : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: guitar.short_description || name,
    image: guitar.images,
    sku: guitar.slug,
    category: guitar.category === "guitar" ? guitarTypeLabel(guitar.type) : categoryLabel(guitar.category),
    brand: { "@type": "Brand", name: guitar.brand },
    itemCondition: "https://schema.org/UsedCondition",
    url,
  };

  if (offer) {
    schema.offers = {
      "@type": "Offer",
      url,
      priceCurrency: offer.currency,
      price: offer.price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: availabilityFor(guitar.status),
      seller: { "@id": BUSINESS_ID },
    };
  }

  return schema;
}

/** Schema para una pagina de servicio (ej: /reparaciones). Referencia al
 *  LocalBusiness como provider y arma un OfferCatalog con los servicios. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  catalog: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: opts.url,
    provider: { "@id": BUSINESS_ID },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios disponibles",
      itemListElement: opts.catalog.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
      })),
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
