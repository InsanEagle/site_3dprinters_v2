import { Metadata } from "next";
import { CatalogFilters } from "@/components/shared/catalog-filters";
import { CategoryGrid } from "@/components/shared/category-grid";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";
import { catalogContent } from "@/data/content";
import { categories, products } from "@/data/site";
import { filterProducts, getCategoryBySlug, getCategoryProductCounts, normalizeCatalogQuery } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог | Изготовление деталей",
  description: catalogContent.description
};

export default async function CatalogPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = normalizeCatalogQuery(params.q);
  const requestedCategory = normalizeCatalogQuery(params.category);
  const selectedCategory = getCategoryBySlug(requestedCategory)?.slug;
  const filteredProducts = filterProducts(products, { category: selectedCategory, query });
  const categoryCounts = getCategoryProductCounts();

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle eyebrow="Каталог" title={catalogContent.title} description={catalogContent.description} />

        <CatalogFilters
          pathname="/catalog"
          categories={categories}
          selectedCategory={selectedCategory}
          query={query}
          resultsCount={filteredProducts.length}
          totalCount={products.length}
        />

        <div className="mb-12 rounded-[32px] border border-line bg-surface p-8">
          <p className="max-w-3xl text-base leading-7 text-body sm:text-lg">{catalogContent.helperText}</p>
        </div>

        <SectionTitle title="Категории" description="Можно перейти сразу в нужную группу изделий." />
        <CategoryGrid items={categories} counts={categoryCounts} searchQuery={query || undefined} />

        <div className="mt-16">
          <SectionTitle
            title="Позиции каталога"
            description="Типовые карточки помогают быстрее перейти к похожим изделиям и оставить заявку по своей задаче."
          />
          {filteredProducts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <StatePanel
              title={catalogContent.emptyTitle}
              description={catalogContent.emptyText}
              compact
              className="px-0"
              actions={
                <>
                  <Button href="/catalog" variant="secondary">
                    Сбросить фильтры
                  </Button>
                  <Button href="/contacts" variant="ghost">
                    Оставить заявку
                  </Button>
                </>
              }
            />
          )}
        </div>
      </Container>
    </div>
  );
}
