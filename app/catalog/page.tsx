import { Metadata } from "next";
import { CategoryGrid } from "@/components/shared/category-grid";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { categories, products } from "@/data/site";

export const metadata: Metadata = {
  title: "Каталог | AutoParts FDM",
  description: "Каталог 3D-печатных автомобильных деталей с категориями, карточками товаров и базовой структурой фильтров."
};

export default function CatalogPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="Каталог"
          title="Каталог автомобильных деталей"
          description="Для MVP фильтры показаны в базовом виде, а товары заполнены демонстрационными данными. Архитектура уже готова для реального наполнения."
        />

        <div className="mb-12 grid gap-4 rounded-3xl border border-line bg-surface p-6 lg:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Категория
            <select className="rounded-xl border border-line bg-white px-4 py-3 text-body">
              <option>Все категории</option>
              {categories.map((category) => (
                <option key={category.slug}>{category.title}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Марка автомобиля
            <select className="rounded-xl border border-line bg-white px-4 py-3 text-body">
              <option>Все марки</option>
              <option>TODO: заполнить</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Модель
            <select className="rounded-xl border border-line bg-white px-4 py-3 text-body">
              <option>Все модели</option>
              <option>TODO: заполнить</option>
            </select>
          </label>
        </div>

        <SectionTitle title="Категории" description="Можно перейти сразу в нужную группу товаров." />
        <CategoryGrid items={categories} />

        <div className="mt-16">
          <SectionTitle title="Товары" description="Список легко масштабируется: позже можно заменить mock-данные на CMS, JSON или API без полной переделки страницы." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

