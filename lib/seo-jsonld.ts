import { brandContent, faqContent, servicesContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getProductImages } from "@/lib/catalog";
import { getSafeEmailHref, getSafeExternalHref, getSafePhoneHref, getSafeText } from "@/lib/content";
import { Product } from "@/types";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
  return configuredUrl.replace(/\/+$/, "");
}

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${getSiteUrl()}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function organizationName() {
  return getSafeText(siteConfig.name) ?? getSafeText(siteConfig.shortName) ?? brandContent.workingTitle;
}

export function createOrganizationJsonLd() {
  const sameAs = [getSafeExternalHref(siteConfig.telegram), getSafeExternalHref(siteConfig.whatsapp)].filter(Boolean);
  const phone = getSafeText(siteConfig.phone);
  const email = getSafeText(siteConfig.email);
  const contactPoint =
    phone || email
      ? {
          "@type": "ContactPoint",
          ...(phone && getSafePhoneHref(phone) ? { telephone: phone } : {}),
          ...(email && getSafeEmailHref(email) ? { email } : {})
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationName(),
    url: getSiteUrl(),
    ...(sameAs.length ? { sameAs } : {}),
    ...(contactPoint ? { contactPoint } : {})
  };
}

export function createProductJsonLd(product: Product) {
  const description = getSafeText(product.description) ?? getSafeText(product.shortDescription);
  const images = getProductImages(product.images).map(absoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(description ? { description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(getSafeText(product.sku) ? { sku: product.sku } : {}),
    url: absoluteUrl(`/product/${product.slug}`)
  };
}

export function createFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqContent.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function createServiceJsonLd(slug: "custom" | "3d-scan") {
  const service = servicesContent.find((item) => item.slug === slug);

  if (!service) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.shortText,
    url: absoluteUrl(`/${slug}`),
    provider: {
      "@type": "Organization",
      name: organizationName(),
      url: getSiteUrl()
    }
  };
}
