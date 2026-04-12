import { products } from "@/data/site";
import {
  canProductBePurchasedDirectly,
  getProductCartStatusMessage,
  getProductImages,
  getProductPriceLabel,
  getProductUnitPrice
} from "@/lib/catalog";
import { getCartDeliverySummary } from "@/lib/delivery";
import { Product } from "@/types";

export const CART_STORAGE_KEY = "site-cart";

export type StoredCartItem = {
  slug: string;
  quantity: number;
};

export type CartItem = {
  slug: string;
  quantity: number;
  product?: Product;
  name: string;
  sku?: string;
  href?: string;
  image?: string;
  priceLabel?: string;
  unitPrice?: number;
  lineTotal?: number;
  canPurchase: boolean;
  statusMessage: string;
  missing: boolean;
};

export type CartSummary = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalCount: number;
  canCheckout: boolean;
  invalidItems: CartItem[];
  purchasableItems: CartItem[];
  deliverySummary: ReturnType<typeof getCartDeliverySummary>;
};

export function sanitizeQuantity(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

export function parseStoredCart(value: string | null): StoredCartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        slug: typeof item?.slug === "string" ? item.slug : "",
        quantity: sanitizeQuantity(Number(item?.quantity))
      }))
      .filter((item) => item.slug);
  } catch {
    return [];
  }
}

export function resolveCartItem(item: StoredCartItem): CartItem {
  const product = products.find((entry) => entry.slug === item.slug);

  if (!product) {
    return {
      slug: item.slug,
      quantity: item.quantity,
      name: "Товар больше не доступен в каталоге",
      canPurchase: false,
      statusMessage: "Позиция больше не найдена в каталоге. Ее можно удалить из корзины.",
      missing: true
    };
  }

  const image = getProductImages(product.images)[0];
  const unitPrice = getProductUnitPrice(product);
  const canPurchase = canProductBePurchasedDirectly(product);

  return {
    slug: item.slug,
    quantity: item.quantity,
    product,
    name: product.name,
    sku: product.sku,
    href: `/product/${product.slug}`,
    image,
    priceLabel: getProductPriceLabel(product),
    unitPrice,
    lineTotal: typeof unitPrice === "number" ? unitPrice * item.quantity : undefined,
    canPurchase,
    statusMessage: getProductCartStatusMessage(product),
    missing: false
  };
}

export function buildCartSummary(storedItems: StoredCartItem[]): CartSummary {
  const items = storedItems.map(resolveCartItem);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (item.canPurchase && typeof item.lineTotal === "number" ? item.lineTotal : 0),
    0
  );
  const purchasableItems = items.filter((item) => item.canPurchase);
  const invalidItems = items.filter((item) => !item.canPurchase);
  const deliverySummary = getCartDeliverySummary(
    purchasableItems.map((item) => item.product).filter((product): product is Product => Boolean(product))
  );

  return {
    items,
    itemCount,
    subtotal,
    subtotalCount: purchasableItems.length,
    canCheckout: items.length > 0 && invalidItems.length === 0 && deliverySummary.isCheckoutSupported,
    invalidItems,
    purchasableItems,
    deliverySummary
  };
}
