import { Category, Product } from "@/types";
import { products as importedProducts } from "@/data/ozon-catalog";
import { resolveProductImages, resolveProductImageTone } from "@/data/product-image-assets";

const publicCategories: Category[] = [
  {
    slug: "panels",
    title: "Панели, консоли и воздуховоды",
    description: "Рамки, центральные консоли, воздуховоды и другие элементы, где важны геометрия, посадка и аккуратный внешний вид."
  },
  {
    slug: "interior",
    title: "Элементы салона",
    description: "Накладки, подстаканники, рамки, декоративные элементы и другие детали салона для замены или аккуратной доработки."
  },
  {
    slug: "moldings",
    title: "Молдинги и кузовные детали",
    description: "Наружные пластиковые детали, молдинги, накладки и другие кузовные элементы, которые удобно подбирать по модели и образцу."
  },
  {
    slug: "repair-parts",
    title: "Крепеж и ремонтные детали",
    description: "Небольшие прикладные детали для ремонта и замены: держатели, заглушки, крепеж, ручки и ремкомплекты."
  }
];

const hiddenProductSkus = new Set([
  "KANC18",
  "KANC290",
  "KANC223",
  "KANC395",
  "KANC229",
  "KANC230",
  "KANC231",
  "KANC312",
  "KANC350",
  "KANC368",
  "KANC232",
  "KANC233",
  "KANC235",
  "KANC236",
  "KANC227",
  "KANC338",
  "KANC388",
  "KANC23",
  "KANC44",
  "KANC381",
  "KANC494",
  "KANC436",
  "KANC495",
  "KANC12",
  "KANC344",
  "KANC401",
  "KANC358",
  "KANC250",
  "KANC251",
  "KANC256",
  "KANC252",
  "KANC255",
  "KANC220",
  "KANC257",
  "KANC359",
  "KANC360",
  "KANC10",
  "KANC351",
  "KANC245",
  "KANC247",
  "KANC238",
  "KANC243",
  "KANC239",
  "KANC242",
  "KANC240",
  "KANC241",
  "KANC36",
  "KANC38",
  "KANC13",
  "KANC31"
]);

const inquiryRepairSkus = new Set([
  "KANC224",
  "KANC202",
  "KANC378",
  "KANC377",
  "KANC50",
  "KANC452",
  "KANC367",
  "KANC438",
  "KANC427",
  "KANC486",
  "KANC355",
  "KANC20",
  "KANC210",
  "KANC216",
  "KANC265",
  "KANC264",
  "KANC237"
]);

export const firstLaunchProductSkus = [
  "KANC367",
  "KANC299",
  "KANC378",
  "KANC237",
  "KANC462",
  "KANC260",
  "KANC349",
  "KANC262",
  "KANC476",
  "KANC324",
  "KANC284",
  "KANC441",
  "KANC254",
  "KANC285",
  "KANC265",
  "KANC259",
  "KANC352",
  "KANC323",
  "KANC289",
  "KANC470",
  "KANC475",
  "KANC442",
  "KANC377",
  "KANC300"
] as const;

export const homepageFeaturedProductSkus = [
  "KANC349",
  "KANC324",
  "KANC323",
  "KANC462",
  "KANC367",
  "KANC378",
  "KANC441"
] as const;

const categoryBySlug = new Map(publicCategories.map((category) => [category.slug, category]));
const categoryOrder = new Map(publicCategories.map((category, index) => [category.slug, index]));

function getPublicCategorySlug(product: Product) {
  if (inquiryRepairSkus.has(product.sku)) {
    return "repair-parts";
  }

  if (product.category === "fasteners" || product.category === "custom-parts") {
    return undefined;
  }

  return product.category;
}

function toPublicProduct(product: Product): Product | undefined {
  if (hiddenProductSkus.has(product.sku)) {
    return undefined;
  }

  const publicCategorySlug = getPublicCategorySlug(product);

  if (!publicCategorySlug) {
    return undefined;
  }

  const publicCategory = categoryBySlug.get(publicCategorySlug);

  if (!publicCategory) {
    return undefined;
  }

  const isInquiryRepairPart = inquiryRepairSkus.has(product.sku);

  return {
    ...product,
    category: publicCategory.slug,
    categoryLabel: publicCategory.title,
    salesMode: isInquiryRepairPart ? "inquiry" : product.salesMode,
    images: resolveProductImages(product),
    imageTone: resolveProductImageTone(product)
  } satisfies Product;
}

export const categories: Category[] = publicCategories;

export const products: Product[] = importedProducts
  .map(toPublicProduct)
  .filter((product): product is Product => Boolean(product))
  .sort((left, right) => {
    const categoryDelta = (categoryOrder.get(left.category) ?? 999) - (categoryOrder.get(right.category) ?? 999);

    if (categoryDelta !== 0) {
      return categoryDelta;
    }

    return left.name.localeCompare(right.name, "ru");
  });

function getPublicProductsBySkuList(skus: readonly string[]) {
  const productBySku = new Map(products.map((product) => [product.sku, product]));

  return skus
    .map((sku) => productBySku.get(sku))
    .filter((product): product is Product => Boolean(product));
}

export const firstLaunchProducts: Product[] = getPublicProductsBySkuList(firstLaunchProductSkus);

export const homepageFeaturedProducts: Product[] = getPublicProductsBySkuList(homepageFeaturedProductSkus);
