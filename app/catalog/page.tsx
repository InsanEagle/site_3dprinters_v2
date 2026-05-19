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
  const hasActiveFilters = Boolean(selectedCategory || query);

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
          resultsAnchorId="catalog-results"
        />

        {hasActiveFilters ? (
          <div className="mb-12 rounded-[32px] border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Результаты</p>
                <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Товары показываются сразу после фильтрации</h2>
                <p className="mt-3 text-base leading-7 text-body">
                  {selectedCategory
                    ? "Сначала показываем найденные позиции, а вспомогательные блоки переносим ниже, чтобы ничего не отвлекало от просмотра товаров."
                    : "При активных фильтрах блок с товарами поднимается выше вспомогательных секций, чтобы результат был сразу перед глазами."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/catalog" variant="secondary">
                  Вернуться ко всему каталогу
                </Button>
                <Button href="/contacts" variant="ghost">
                  Оставить заявку на подбор
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12 rounded-[32px] border border-line bg-surface p-8">
            <p className="max-w-3xl text-base leading-7 text-body sm:text-lg">{catalogContent.helperText}</p>
          </div>
        )}

        <section id="catalog-results" className={`${hasActiveFilters ? "" : "mt-16 "}scroll-mt-28`}>
          <SectionTitle
            title={hasActiveFilters ? "Найденные позиции" : "Позиции каталога"}
            description={
              hasActiveFilters
                ? "Список обновляется по выбранной категории и поисковому запросу. В карточках сразу видно, какие позиции ведут в маркетплейс, а какие лучше уточнять через запрос."
                : "Каталог первого запуска работает как витрина и точка входа в запрос: карточки сразу показывают, где перейти в маркетплейс, а где лучше начать с уточнения задачи."
            }
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
        </section>

        <section className="mt-16">
          <SectionTitle
            title={hasActiveFilters ? "Посмотреть другие категории" : "Категории"}
            description={
              hasActiveFilters
                ? "Если результат не подошел, можно быстро перейти в конкретную группу изделий или вернуться ко всему каталогу без потери общего сценария."
                : "Можно перейти сразу в нужную группу изделий."
            }
            actions={
              hasActiveFilters ? (
                <Button href="/catalog" variant="ghost">
                  Весь каталог
                </Button>
              ) : undefined
            }
          />
          <CategoryGrid items={categories} counts={categoryCounts} searchQuery={query || undefined} />
        </section>

        <section className="mt-16 rounded-[32px] border border-line bg-surface p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Не нашли нужную позицию</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Можно отправить запрос на подбор или изготовление по задаче</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-body sm:text-lg">
            Каталог показывает типовые направления и примеры изделий. Если нужной детали нет, можно оставить заявку с фото, описанием,
            размерами или названием похожей позиции, а детали решения уточним после оценки запроса.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/contacts">Оставить заявку на подбор</Button>
            <Button href="/custom" variant="secondary">
              Изготовление под заказ
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}

