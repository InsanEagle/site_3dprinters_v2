import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/page/product-actions";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGallery } from "@/components/shared/product-gallery";
import { ProductSpecs } from "@/components/shared/product-specs";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { productContent } from "@/data/content";
import {
  canProductBePurchasedDirectly,
  getProductAvailabilityLabel,
  getProductBySlug,
  getProductCommerceNote,
  getProductMarketplaceHref,
  getProductPriceLabel,
  getProductScenarioLabel,
  getProductSalesModeLabel,
  getRelatedProducts,
  hasProductMarketplaceLink,
  isDirectSaleProduct,
  isMarketplaceProduct
} from "@/lib/catalog";
import { getSafeText } from "@/lib/content";
import { getProductDeliverySummary } from "@/lib/delivery";
import { createProductJsonLd } from "@/lib/seo-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Товар`,
    description: product.shortDescription
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.slug, product.category);
  const shortDescription = getSafeText(product.shortDescription);
  const description = getSafeText(product.description);
  const compatibility = getSafeText(product.compatibility);
  const price = getProductPriceLabel(product) ?? productContent.priceFallback;
  const material = getSafeText(product.material);
  const color = getSafeText(product.color);
  const leadTime = getSafeText(product.leadTime) ?? productContent.leadTimeFallback;
  const brand = getSafeText(product.brand);
  const model = getSafeText(product.model);
  const installation = getSafeText(product.installation);
  const delivery = getSafeText(product.delivery) ?? productContent.deliveryFallback;
  const important = getSafeText(product.important);
  const availabilityLabel = getProductAvailabilityLabel(product.availability);
  const salesModeLabel = getProductSalesModeLabel(product.salesMode);
  const scenarioLabel = getProductScenarioLabel(product);
  const commerceNote = getProductCommerceNote(product);
  const deliverySummary = getProductDeliverySummary(product);
  const canAddToCart = canProductBePurchasedDirectly(product);
  const hasMarketplaceUrl = hasProductMarketplaceLink(product);
  const marketplaceHref = getProductMarketplaceHref(product);
  const specItems = [
    { label: "Артикул", value: product.sku },
    ...(material ? [{ label: "Материал", value: material }] : []),
    ...(brand ? [{ label: "Марка", value: brand }] : []),
    ...(model ? [{ label: "Модель", value: model }] : []),
    ...(color ? [{ label: "Цвет", value: color }] : []),
    { label: "Наличие", value: availabilityLabel },
    { label: "Сценарий продажи", value: salesModeLabel },
    { label: "Срок изготовления", value: leadTime }
  ];

  return (
    <div className="py-10 sm:py-14 lg:py-20">
      <JsonLd data={createProductJsonLd(product)} />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] lg:items-start xl:gap-12">
          <div className="lg:sticky lg:top-28">
            <ProductGallery images={product.images} title={product.name} tone={product.imageTone} />
          </div>
          <div>
            <p className="text-sm font-medium text-body">{product.categoryLabel}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{product.name}</h1>
            {shortDescription ? <p className="mt-4 text-lg leading-8 text-body">{shortDescription}</p> : null}
            <div className="mt-6 text-3xl font-semibold text-ink">{price}</div>
            <p className="mt-2 text-sm font-medium text-accent">{scenarioLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
              <span className="rounded-full bg-surface px-3 py-1 text-body">{salesModeLabel}</span>
              <span className="rounded-full bg-surface px-3 py-1 text-body">{availabilityLabel}</span>
            </div>
            <p className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-body">{commerceNote}</p>
            {isDirectSaleProduct(product) ? (
              <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-4 text-sm leading-6 text-body">
                <p className="font-semibold text-ink">Получение заказа</p>
                <p className="mt-2">{deliverySummary.summary}</p>
                <p className="mt-2">Доступные способы: {deliverySummary.methodLabels}.</p>
                <p className="mt-2">{deliverySummary.checkoutNote}</p>
              </div>
            ) : null}
            {isMarketplaceProduct(product) && hasMarketplaceUrl && marketplaceHref ? (
              <p className="mt-4 text-sm leading-6 text-body">
                На первом этапе сайт работает как витрина товара и точка входа в обращение. Для этой позиции основной канал покупки вынесен на маркетплейс, а на сайте сохраняем описание и переход в актуальный канал.
              </p>
            ) : null}
            {isDirectSaleProduct(product) ? (
              <p className="mt-4 text-sm leading-6 text-body">
                {canAddToCart
                  ? "Для этой позиции доступна базовая корзина: можно добавить товар, изменить количество и собрать набор перед следующим этапом оформления."
                  : "Для этой позиции корзина пока не используется: если цена или условия требуют уточнения, сайт честно оставляет direct-sale сценарий через запрос."}
              </p>
            ) : null}
            {!isDirectSaleProduct(product) && !isMarketplaceProduct(product) ? (
              <p className="mt-4 text-sm leading-6 text-body">
                Для этой позиции первый публичный сценарий остается заявочным: сначала уточняем параметры, совместимость и способ решения, а уже потом подтверждаем дальнейшие шаги.
              </p>
            ) : null}
            <div className="mt-6">
              <ProductActions product={product} />
            </div>
            <div className="mt-8">
              <ProductSpecs items={specItems} />
            </div>
            {!compatibility ? (
              <p className="mt-6 rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-body">
                {productContent.compatibilityFallback}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-16 grid gap-6">
          {description ? (
            <section className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Описание</h2>
              <p className="mt-4 text-base leading-7 text-body">{description}</p>
            </section>
          ) : null}
          {compatibility ? (
            <section className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Совместимость</h2>
              <p className="mt-4 text-base leading-7 text-body">{compatibility}</p>
            </section>
          ) : null}
          {installation ? (
            <section className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Установка</h2>
              <p className="mt-4 text-base leading-7 text-body">{installation}</p>
            </section>
          ) : null}
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Передача изделия</h2>
            <p className="mt-4 text-base leading-7 text-body">{delivery}</p>
          </section>
          {important ? (
            <section className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Важно знать</h2>
              <p className="mt-4 text-base leading-7 text-body">{important}</p>
            </section>
          ) : null}
        </div>

        {relatedProducts.length ? (
          <div className="mt-16">
            <SectionTitle title="Похожие товары" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard key={related.slug} product={related} />
              ))}
            </div>
          </div>
        ) : (
          <section className="mt-16 rounded-[32px] border border-line bg-surface p-8">
            <h2 className="text-2xl font-semibold text-ink">Нужна похожая позиция или вариант под вашу задачу?</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-body">
              В этой группе пока показана только одна типовая позиция. Если нужен похожий элемент, можно перейти в
              категорию или оставить заявку с описанием задачи.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={`/catalog/${product.category}`} variant="secondary">
                Открыть категорию
              </Button>
              <Button href="/catalog">Смотреть каталог</Button>
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
