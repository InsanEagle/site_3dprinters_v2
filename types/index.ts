export type Category = {
  slug: string;
  title: string;
  description: string;
};

export type ProductSalesMode = "direct" | "marketplace" | "inquiry";
export type ProductAvailabilityStatus = "in_stock" | "made_to_order" | "out_of_stock" | "on_request";
export type ProductPriceType = "fixed" | "from" | "on_request";
export type ProductDeliveryClass = "standard" | "pickup_only";

export type ProductPrice = {
  type: ProductPriceType;
  amount?: number;
  currency?: "RUB";
  note?: string;
};

export type ProductMarketplace = {
  provider: "ozon";
  url?: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  categoryLabel: string;
  salesMode: ProductSalesMode;
  availability: ProductAvailabilityStatus;
  deliveryClass: ProductDeliveryClass;
  pricing: ProductPrice;
  marketplace?: ProductMarketplace;
  compatibility: string;
  price: string;
  material: string;
  color: string;
  leadTime: string;
  images: string[];
  imageTone?: "neutral" | "dark";
  shortDescription: string;
  description: string;
  installation: string;
  delivery: string;
  important: string;
  brand: string;
  model: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type EquipmentItem = {
  title: string;
  quantity: string;
  description: string;
};
