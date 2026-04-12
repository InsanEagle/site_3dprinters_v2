import { Category } from "@/types";
import { Button } from "@/components/ui/button";

type CatalogFiltersProps = {
  pathname: string;
  categories: Category[];
  selectedCategory?: string;
  query: string;
  resultsCount: number;
  totalCount: number;
  categoryLocked?: boolean;
  resultsAnchorId?: string;
};

export function CatalogFilters({
  pathname,
  categories,
  selectedCategory,
  query,
  resultsCount,
  totalCount,
  categoryLocked = false,
  resultsAnchorId
}: CatalogFiltersProps) {
  const activeFiltersCount = Number(Boolean(selectedCategory)) + Number(Boolean(query));
  const currentCategory = categories.find((category) => category.slug === selectedCategory);
  const resetHref = categoryLocked ? pathname : "/catalog";
  const formAction = resultsAnchorId ? `${pathname}#${resultsAnchorId}` : pathname;

  return (
    <div className="mb-12 rounded-3xl border border-line bg-surface p-6">
      <form action={formAction} className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)_auto_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Поиск по каталогу
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Название, категория или slug"
            className="rounded-xl border border-line bg-white px-4 py-3 text-body"
          />
        </label>

        {categoryLocked ? (
          <div className="grid gap-2 text-sm font-medium text-ink">
            Текущая категория
            <div className="rounded-xl border border-line bg-white px-4 py-3 text-body">
              {currentCategory?.title ?? "Выбранная категория"}
            </div>
          </div>
        ) : (
          <label className="grid gap-2 text-sm font-medium text-ink">
            Категория
            <select
              name="category"
              defaultValue={selectedCategory ?? ""}
              className="rounded-xl border border-line bg-white px-4 py-3 text-body"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
        )}

        <Button type="submit" className="w-full lg:w-auto">
          Показать
        </Button>
        <Button href={resetHref} variant="secondary" className="w-full lg:w-auto">
          Сбросить
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-2 text-sm text-body sm:flex-row sm:items-center sm:justify-between">
        <p>
          Найдено {resultsCount} из {totalCount} {totalCount === 1 ? "позиции" : "позиций"}.
        </p>
        <p>
          {activeFiltersCount
            ? `Активных фильтров: ${activeFiltersCount}.${resultsAnchorId ? " После применения форма переводит к блоку с результатами." : ""}`
            : "Фильтры не применены."}
        </p>
      </div>
    </div>
  );
}
