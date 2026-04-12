import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { productContent } from "@/data/content";
import {
  canProductBePurchasedDirectly,
  getProductAvailabilityLabel,
  getProductCardCtaLabel,
  getProductCardHref,
  getProductCartStatusMessage,
  getProductImages,
  getProductPriceLabel,
  getProductSalesModeLabel,
  getProductScenarioLabel
} from "@/lib/catalog";
import { getSafeText } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  const summary = getSafeText(product.shortDescription) ?? getSafeText(product.compatibility) ?? productContent.compatibilityFallback;
  const price = getProductPriceLabel(product) ?? productContent.priceFallback;
  const images = getProductImages(product.images);
  const primaryImage = images[0];
  const availabilityLabel = getProductAvailabilityLabel(product.availability);
  const salesModeLabel = getProductSalesModeLabel(product.salesMode);
  const scenarioLabel = getProductScenarioLabel(product);
  const cardHref = getProductCardHref(product);
  const ctaLabel = getProductCardCtaLabel(product);
  const canAddToCart = canProductBePurchasedDirectly(product);
  const cartStatusMessage = getProductCartStatusMessage(product);

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
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
        <span className="rounded-full bg-surface px-3 py-1 text-body">{salesModeLabel}</span>
        <span className="rounded-full bg-surface px-3 py-1 text-body">{availabilityLabel}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-body">{summary}</p>
      <div className="mt-auto pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">{scenarioLabel}</p>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-semibold text-ink">{price}</span>
            {canAddToCart ? (
              <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-body transition hover:text-ink">
                Подробнее
              </Link>
            ) : (
              <Button href={cardHref} variant="secondary" className="px-4 py-2.5">
                {ctaLabel}
              </Button>
            )}
          </div>
          {canAddToCart ? (
            <AddToCartButton slug={product.slug} className="w-full" />
          ) : (
            <p className="text-sm leading-6 text-body">{cartStatusMessage}</p>
          )}
        </div>
      </div>
    </article>
  );
}
