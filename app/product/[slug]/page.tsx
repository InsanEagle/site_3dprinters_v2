import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/page/product-actions";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGallery } from "@/components/shared/product-gallery";
import { ProductSpecs } from "@/components/shared/product-specs";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { productContent } from "@/data/content";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getSafeText } from "@/lib/content";

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
  const price = getSafeText(product.price) ?? productContent.priceFallback;
  const material = getSafeText(product.material);
  const color = getSafeText(product.color);
  const leadTime = getSafeText(product.leadTime) ?? productContent.leadTimeFallback;
  const brand = getSafeText(product.brand);
  const model = getSafeText(product.model);
  const installation = getSafeText(product.installation);
  const delivery = getSafeText(product.delivery) ?? productContent.deliveryFallback;
  const important = getSafeText(product.important);
  const specItems = [
    ...(material ? [{ label: "Материал", value: material }] : []),
    ...(brand ? [{ label: "Марка", value: brand }] : []),
    ...(model ? [{ label: "Модель", value: model }] : []),
    ...(color ? [{ label: "Цвет", value: color }] : []),
    { label: "Срок изготовления", value: leadTime }
  ];

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images} title={product.name} />
          <div>
            <p className="text-sm font-medium text-body">{product.categoryLabel}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{product.name}</h1>
            {shortDescription ? <p className="mt-4 text-lg leading-8 text-body">{shortDescription}</p> : null}
            <div className="mt-6 text-3xl font-semibold text-ink">{price}</div>
            <div className="mt-6">
              <ProductActions productName={product.name} />
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
