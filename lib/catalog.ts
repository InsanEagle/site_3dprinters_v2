import { categories, products } from "@/data/site";

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
