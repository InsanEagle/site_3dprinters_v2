import { getSafeText } from "@/lib/content";
import { categories, products } from "@/data/site";
import { Product } from "@/types";

export type CatalogFilters = {
  category?: string;
  query?: string;
};

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function getRelatedProducts(slug: string, category: string) {
  return products.filter((product) => product.slug !== slug && product.category === category).slice(0, 3);
}

export function normalizeCatalogQuery(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return rawValue?.trim().replace(/\s+/g, " ") ?? "";
}

export function getProductImages(images: string[]) {
  return images.filter((image) => {
    const value = getSafeText(image);

    if (!value) {
      return false;
    }

    return /^(https?:\/\/|\/)/i.test(value);
  });
}

function matchesCatalogQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  const searchIndex = [
    product.name,
    product.slug,
    product.categoryLabel,
    getSafeText(product.shortDescription),
    getSafeText(product.material)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchIndex.includes(normalizedQuery);
}

export function filterProducts(items: Product[], filters: CatalogFilters) {
  return items.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    return matchesCatalogQuery(product, filters.query ?? "");
  });
}

export function getCategoryProductCounts() {
  return Object.fromEntries(categories.map((category) => [category.slug, getProductsByCategory(category.slug).length]));
}
