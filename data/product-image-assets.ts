import { Product } from "@/types";

export type ProductImageAssetConfig = {
  images: string[];
  tone?: Product["imageTone"];
};

// Local product assets live in /public/product-images/<SKU>/...
// Recommended naming:
// - cover.png
// - view-2.png
// - view-3.png
//
// Add new entries by SKU when a product gets prepared PNG assets.
// If an entry is absent, the catalog falls back to the imported marketplace images.
export const productImageAssets: Record<string, ProductImageAssetConfig> = {
  KANC474: {
    images: [
      "/product-images/KANC474/cover.png",
      "/product-images/KANC474/view-2.png",
      "/product-images/KANC474/view-3.png"
    ],
    tone: "dark"
  }
};

export function resolveProductImages(product: Product) {
  const assetConfig = productImageAssets[product.sku];

  if (!assetConfig?.images.length) {
    return product.images;
  }

  return assetConfig.images;
}

export function resolveProductImageTone(product: Product) {
  return productImageAssets[product.sku]?.tone ?? product.imageTone;
}
