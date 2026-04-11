import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

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
  return ["moldings", "panels", "spoilers", "interior", "fasteners", "custom-parts"].map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const currentCategory = getCategoryBySlug(category);

  if (!currentCategory) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category);

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle eyebrow="Категория" title={currentCategory.title} description={currentCategory.description} />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-14 rounded-[32px] border border-line bg-surface p-8">
          <h2 className="text-3xl font-semibold text-ink">Нужна похожая деталь, но в каталоге ее нет?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">
            Перейдите на страницу изготовления под заказ и отправьте фото, описание или образец. Это особенно полезно для редких и нестандартных элементов.
          </p>
          <div className="mt-6">
            <Button href="/custom">Перейти к изготовлению под заказ</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

