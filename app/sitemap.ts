import type { MetadataRoute } from "next";
import { categories, products } from "@/data/site";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/catalog", priority: 0.9 },
  { path: "/custom", priority: 0.85 },
  { path: "/3d-scan", priority: 0.8 },
  { path: "/delivery", priority: 0.65 },
  { path: "/faq", priority: 0.6 },
  { path: "/contacts", priority: 0.75 },
  { path: "/about", priority: 0.5 }
] as const;

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
  return configuredUrl.replace(/\/+$/, "");
}

function createSitemapUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: createSitemapUrl(baseUrl, route.path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route.priority
  }));

  const categoryEntries = categories.map((category) => ({
    url: createSitemapUrl(baseUrl, `/catalog/${category.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const productEntries = products.map((product) => ({
    url: createSitemapUrl(baseUrl, `/product/${product.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
