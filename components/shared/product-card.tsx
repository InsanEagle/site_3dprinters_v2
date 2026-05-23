import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductImageStage } from "@/components/shared/product-image-stage";
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
import { cn } from "@/lib/utils";
import { Product } from "@/types";

function ProductCardMedia({ product, primaryImage, compact }: { product: Product; primaryImage?: string; compact?: boolean }) {
  if (primaryImage) {
    return (
      <ProductImageStage
        image={primaryImage}
        title={product.name}
        tone={product.imageTone ?? "neutral"}
        size={compact ? "thumbnail" : "card"}
        className={compact ? "mb-4" : "mb-5"}
        testId={`product-card-media-${product.slug}`}
      />
    );
  }

  return (
    <div
      data-testid={`product-card-media-${product.slug}`}
      className="relative mb-5 overflow-hidden rounded-[28px] border border-line/80 bg-[#f7f8fa]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,247,248,0.98)_58%,rgba(236,240,244,1)_100%)]" />
      <div className="absolute inset-x-[8%] inset-y-[10%] rounded-[24px] border border-white/70 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.96)_0%,rgba(249,250,251,0.86)_40%,rgba(243,245,247,0.18)_72%,rgba(243,245,247,0)_100%)]" />
      <div className={cn("relative flex flex-col justify-between p-5 sm:p-6", compact ? "h-52 sm:h-64" : "h-64 sm:h-72")}>
        <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-body shadow-[0_4px_12px_rgba(31,35,40,0.04)]">
          Без фото
        </span>
        <div className="max-w-[16rem]">
          <p className="text-sm font-medium text-body">{product.categoryLabel}</p>
          <p className="mt-2 text-lg font-semibold leading-7 text-ink">{product.name}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
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
    <article
      data-testid={`product-card-${product.slug}`}
      className={cn(
        "group flex h-full flex-col border border-line/90 bg-white shadow-[0_6px_18px_rgba(31,35,40,0.035)] transition hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-card",
        compact ? "rounded-[24px] p-4 sm:rounded-3xl sm:p-5" : "rounded-3xl p-5"
      )}
    >
      <ProductCardMedia product={product} primaryImage={primaryImage} compact={compact} />
      <p className="text-sm text-body">{product.categoryLabel}</p>
      <h3 className={cn("mt-2 font-semibold text-ink", compact ? "text-lg leading-7 sm:text-xl" : "text-xl")}>{product.name}</h3>
      <div className={cn("mt-3 flex flex-wrap text-xs font-semibold uppercase tracking-[0.08em]", compact ? "gap-1.5 sm:gap-2" : "gap-2")}>
        <span className={cn("rounded-full bg-surface text-body", compact ? "px-2.5 py-1 sm:px-3" : "px-3 py-1")}>{salesModeLabel}</span>
        <span className={cn("rounded-full bg-surface text-body", compact ? "px-2.5 py-1 sm:px-3" : "px-3 py-1")}>{availabilityLabel}</span>
      </div>
      <p className={cn("mt-3 text-sm leading-6 text-body", compact ? "hidden sm:block" : "")}>{summary}</p>
      <div className={cn("mt-auto", compact ? "pt-4 sm:pt-5" : "pt-5")}>
        <p className={cn("text-xs font-semibold uppercase tracking-[0.08em] text-accent", compact ? "leading-5" : "")}>{scenarioLabel}</p>
        <div className={cn("mt-2 flex flex-col", compact ? "gap-3 sm:gap-4" : "gap-4")}>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <span className={cn("font-semibold leading-6 text-ink", compact ? "text-sm sm:text-lg sm:leading-7" : "text-base sm:text-lg sm:leading-7")}>{price}</span>
            {canAddToCart ? (
              <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-body transition hover:text-ink">
                Подробнее
              </Link>
            ) : (
              <Button href={cardHref} variant="secondary" className={compact ? "px-3.5 py-2.5" : "px-4 py-2.5"}>
                {ctaLabel}
              </Button>
            )}
          </div>
          {canAddToCart ? (
            <AddToCartButton slug={product.slug} className="w-full" />
          ) : (
            <p className="hidden text-sm leading-6 text-body sm:block">{cartStatusMessage}</p>
          )}
        </div>
      </div>
    </article>
  );
}
