import { Product } from "@/types";

export type ProductImageAssetConfig = {
  images?: string[];
  cardImage?: string;
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
  KANC323: {
    cardImage: "/product-images/KANC323/card.png"
  },
  KANC324: {
    cardImage: "/product-images/KANC324/card.png"
  },
  KANC349: {
    cardImage: "/product-images/KANC349/card.png"
  },
  KANC367: {
    cardImage: "/product-images/KANC367/card.png"
  },
  KANC378: {
    cardImage: "/product-images/KANC378/card.png"
  },
  KANC441: {
    cardImage: "/product-images/KANC441/card.png"
  },
  KANC462: {
    cardImage: "/product-images/KANC462/card.png"
  },
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
  const images = productImageAssets[product.sku]?.images;

  if (!images?.length) {
    return product.images;
  }

  return images;
}

export function resolveProductCardImage(product: Product) {
  const assetConfig = productImageAssets[product.sku];

  if (assetConfig?.cardImage) {
    return assetConfig.cardImage;
  }

  return resolveProductImages(product)[0] ?? product.images[0];
}

export function resolveProductImageTone(product: Product) {
  return productImageAssets[product.sku]?.tone ?? product.imageTone;
}
