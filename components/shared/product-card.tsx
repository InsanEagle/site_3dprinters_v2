import { Product } from "@/types";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-5">
      <div className="mb-5 flex h-56 items-end rounded-2xl border border-dashed border-line bg-surface p-4">
        <p className="max-w-52 text-sm text-body">{product.images[0]}</p>
      </div>
      <p className="text-sm text-body">{product.categoryLabel}</p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
      <p className="mt-3 text-sm leading-6 text-body">{product.compatibility}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-ink">{product.price}</span>
        <Button href={`/product/${product.slug}`} variant="secondary" className="px-4 py-2.5">
          Подробнее
        </Button>
      </div>
    </article>
  );
}

