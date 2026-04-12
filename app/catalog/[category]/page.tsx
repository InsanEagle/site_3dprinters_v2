import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/shared/catalog-filters";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/site";
import { filterProducts, getCategoryBySlug, getProductsByCategory, normalizeCatalogQuery } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const item = getCategoryBySlug(category);

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} | Каталог`,
    description: item.description
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { category } = await params;
  const currentCategory = getCategoryBySlug(category);

  if (!currentCategory) {
    notFound();
  }

  const { q } = await searchParams;
  const query = normalizeCatalogQuery(q);
  const categoryProducts = getProductsByCategory(category);
  const filteredProducts = filterProducts(categoryProducts, { query });

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle eyebrow="Категория" title={currentCategory.title} description={currentCategory.description} />

        <CatalogFilters
          pathname={`/catalog/${currentCategory.slug}`}
          categories={categories}
          selectedCategory={currentCategory.slug}
          query={query}
          resultsCount={filteredProducts.length}
          totalCount={categoryProducts.length}
          categoryLocked
        />

        {filteredProducts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <StatePanel
            title="Подходящих позиций в этой категории пока не найдено"
            description="Попробуйте изменить запрос или вернуться к полному каталогу, чтобы посмотреть другие направления."
            compact
            className="px-0"
            actions={
              <>
                <Button href={`/catalog/${currentCategory.slug}`} variant="secondary">
                  Сбросить поиск
                </Button>
                <Button href="/catalog">Открыть весь каталог</Button>
              </>
            }
          />
        )}

        <div className="mt-14 rounded-[32px] border border-line bg-surface p-8">
          <h2 className="text-3xl font-semibold text-ink">Нужна похожая деталь, но в каталоге ее нет?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">
            Перейдите на страницу изготовления под заказ и отправьте фото, описание или образец. Это особенно полезно для
            редких и нестандартных элементов.
          </p>
          <div className="mt-6">
            <Button href="/custom">Перейти к изготовлению под заказ</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
