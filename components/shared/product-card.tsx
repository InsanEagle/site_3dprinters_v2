import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { productContent } from "@/data/content";
import { getProductImages } from "@/lib/catalog";
import { getSafeText } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  const summary = getSafeText(product.shortDescription) ?? getSafeText(product.compatibility) ?? productContent.compatibilityFallback;
  const price = getSafeText(product.price) ?? productContent.priceFallback;
  const images = getProductImages(product.images);
  const primaryImage = images[0];

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-5">
      {primaryImage ? (
        <div className="mb-5 overflow-hidden rounded-2xl border border-line bg-surface">
          <img src={primaryImage} alt={product.name} className="h-56 w-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="mb-5 flex h-56 flex-col justify-between rounded-2xl border border-line bg-[linear-gradient(135deg,_#f6f7f8_0%,_#eceff3_100%)] p-4">
          <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-body">
            Без фото
          </span>
          <div>
            <p className="text-sm font-medium text-body">{product.categoryLabel}</p>
            <p className="mt-2 max-w-52 text-base font-semibold text-ink">{product.name}</p>
          </div>
        </div>
      )}
      <p className="text-sm text-body">{product.categoryLabel}</p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
      <p className="mt-3 text-sm leading-6 text-body">{summary}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-ink">{price}</span>
        <Button href={`/product/${product.slug}`} variant="secondary" className="px-4 py-2.5">
          Подробнее
        </Button>
      </div>
    </article>
  );
}
