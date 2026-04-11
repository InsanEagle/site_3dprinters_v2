import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ProductActions } from "@/components/page/product-actions";
import { ProductGallery } from "@/components/shared/product-gallery";
import { ProductCard } from "@/components/shared/product-card";
import { ProductSpecs } from "@/components/shared/product-specs";
import { SectionTitle } from "@/components/shared/section-title";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";

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

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images} title={product.name} />
          <div>
            <p className="text-sm font-medium text-body">{product.categoryLabel}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-body">{product.shortDescription}</p>
            <div className="mt-6 text-3xl font-semibold text-ink">{product.price}</div>
            <div className="mt-6">
              <ProductActions productName={product.name} />
            </div>
            <div className="mt-8">
              <ProductSpecs
                items={[
                  { label: "Совместимость", value: product.compatibility },
                  { label: "Материал", value: product.material },
                  { label: "Цвет", value: product.color },
                  { label: "Срок изготовления / отправки", value: product.leadTime }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6">
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Описание</h2>
            <p className="mt-4 text-base leading-7 text-body">{product.description}</p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Совместимость</h2>
            <p className="mt-4 text-base leading-7 text-body">{product.compatibility}</p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Характеристики</h2>
            <div className="mt-4 grid gap-3 text-base leading-7 text-body">
              <p>Материал: {product.material}</p>
              <p>Цвет: {product.color}</p>
              <p>Марка: {product.brand}</p>
              <p>Модель: {product.model}</p>
            </div>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Установка</h2>
            <p className="mt-4 text-base leading-7 text-body">{product.installation}</p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Доставка и оплата</h2>
            <p className="mt-4 text-base leading-7 text-body">{product.delivery}</p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Важно знать</h2>
            <p className="mt-4 text-base leading-7 text-body">{product.important}</p>
          </section>
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
        ) : null}
      </Container>
    </div>
  );
}
