import { getSafeText } from "@/lib/content";
import { categories, products } from "@/data/site";
import { Product, ProductAvailabilityStatus, ProductSalesMode } from "@/types";

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

const availabilityLabels: Record<ProductAvailabilityStatus, string> = {
  in_stock: "В наличии",
  made_to_order: "Под заказ",
  out_of_stock: "Нет в наличии",
  on_request: "Наличие уточняется"
};

const salesModeLabels: Record<ProductSalesMode, string> = {
  direct: "Прямая продажа",
  marketplace: "Маркетплейс",
  inquiry: "По запросу"
};

export function getProductAvailabilityLabel(status: ProductAvailabilityStatus) {
  return availabilityLabels[status];
}

export function getProductSalesModeLabel(mode: ProductSalesMode) {
  return salesModeLabels[mode];
}

export function isDirectSaleProduct(product: Product) {
  return product.salesMode === "direct";
}

export function isMarketplaceProduct(product: Product) {
  return product.salesMode === "marketplace";
}

export function isInquiryProduct(product: Product) {
  return product.salesMode === "inquiry";
}

export function hasProductFixedPrice(product: Product) {
  return typeof product.pricing.amount === "number" && Number.isFinite(product.pricing.amount) && product.pricing.type !== "on_request";
}

export function getProductUnitPrice(product: Product) {
  if (product.pricing.type !== "fixed") {
    return undefined;
  }

  return hasProductFixedPrice(product) ? product.pricing.amount : undefined;
}

export function canProductBePurchasedDirectly(product: Product) {
  return isDirectSaleProduct(product) && typeof getProductUnitPrice(product) === "number" && product.availability !== "out_of_stock";
}

export function getProductCartStatusMessage(product: Product) {
  if (!isDirectSaleProduct(product)) {
    return isMarketplaceProduct(product)
      ? "Покупка этой позиции уточняется отдельно, поэтому корзина сайта для нее не используется."
      : "Позиция оформляется через запрос, поэтому корзина для нее не используется.";
  }

  if (product.availability === "out_of_stock") {
    return "Позиция временно недоступна, поэтому добавить ее в корзину нельзя.";
  }

  if (typeof getProductUnitPrice(product) !== "number") {
    return getSafeText(product.pricing.note) ?? "Для этой позиции пока нет честной фиксированной цены, поэтому корзина не используется.";
  }

  return "Позицию можно добавить в корзину и сохранить для дальнейшего оформления.";
}

export function hasProductMarketplaceLink(product: Product) {
  return Boolean(getSafeText(product.marketplace?.url));
}

export function getProductMarketplaceHref(product: Product) {
  return getSafeText(product.marketplace?.url);
}

export function getProductPriceLabel(product: Product) {
  const { pricing } = product;

  if (pricing.type === "on_request") {
    return getSafeText(pricing.note) ?? "Цена уточняется";
  }

  if (typeof pricing.amount !== "number" || !Number.isFinite(pricing.amount)) {
    return getSafeText(pricing.note) ?? "Цена уточняется";
  }

  const formattedAmount = new Intl.NumberFormat("ru-RU").format(pricing.amount);
  return pricing.type === "from" ? `от ${formattedAmount} ₽` : `${formattedAmount} ₽`;
}

export function getProductCommerceNote(product: Product) {
  if (isDirectSaleProduct(product)) {
    if (hasProductFixedPrice(product)) {
      return "Позиция подготовлена под прямую продажу на сайте. Пока без корзины: заказ подтверждается вручную после запроса.";
    }

    return getSafeText(product.pricing.note) ?? "Позиция переведена в прямой сценарий, но итоговая цена пока подтверждается перед покупкой.";
  }

  if (isMarketplaceProduct(product)) {
    return hasProductMarketplaceLink(product)
      ? "Для этой позиции основным остается покупка через маркетплейс. На сайте показываем товар и даем переход в актуальный канал покупки."
      : "Для этой позиции покупка уточняется отдельно. Прямая покупка на сайте пока не является основным потоком.";
  }

  return "Для этой позиции сохраняется сценарий запроса: сначала уточняются параметры, затем подтверждается возможность изготовления или подбора.";
}

export function getProductScenarioLabel(product: Product) {
  if (isDirectSaleProduct(product)) {
    return "Можно заказать через сайт";
  }

  if (isMarketplaceProduct(product)) {
    return "Покупка через маркетплейс";
  }

  return "Сначала уточняем задачу";
}

export function getProductCardHref(product: Product) {
  if (isDirectSaleProduct(product)) {
    return `/product/${product.slug}#purchase`;
  }

  if (isInquiryProduct(product)) {
    return `/product/${product.slug}#request`;
  }

  return `/product/${product.slug}`;
}

export function getProductCardCtaLabel(product: Product) {
  if (isDirectSaleProduct(product)) {
    return hasProductFixedPrice(product) ? "Купить" : "Запросить покупку";
  }

  if (isMarketplaceProduct(product)) {
    return hasProductMarketplaceLink(product) ? "Где купить" : "Уточнить сценарий";
  }

  return "Оставить запрос";
}

function matchesCatalogQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  const searchIndex = [
    product.name,
    product.sku,
    product.slug,
    product.categoryLabel,
    getSafeText(product.shortDescription),
    getSafeText(product.material),
    getProductSalesModeLabel(product.salesMode)
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
