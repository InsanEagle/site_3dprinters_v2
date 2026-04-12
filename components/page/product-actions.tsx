"use client";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useRequestModal } from "@/components/shared/request-modal";
import { Button } from "@/components/ui/button";
import {
  canProductBePurchasedDirectly,
  getProductCartStatusMessage,
  hasProductFixedPrice,
  hasProductMarketplaceLink,
  isDirectSaleProduct,
  isMarketplaceProduct
} from "@/lib/catalog";
import { getProductDeliverySummary } from "@/lib/delivery";
import {
  getBuyFallbackFormText,
  getMarketplaceFallbackFormText,
  getProductQuestionFormText,
  getProductRequestFormText
} from "@/lib/request-ui";
import { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const { openModal } = useRequestModal();
  const requestCopy = getProductRequestFormText(product.name);
  const questionCopy = getProductQuestionFormText(product.name);
  const buyCopy = getBuyFallbackFormText(product.name);
  const marketplaceCopy = getMarketplaceFallbackFormText(product.name);
  const hasFixedPrice = hasProductFixedPrice(product);
  const hasMarketplaceUrl = hasProductMarketplaceLink(product);
  const marketplaceHref = product.marketplace?.url;
  const sectionId = isDirectSaleProduct(product) ? "purchase" : "request";
  const canAddToCart = canProductBePurchasedDirectly(product);
  const cartStatusMessage = getProductCartStatusMessage(product);
  const deliverySummary = getProductDeliverySummary(product);

  return (
    <div className="rounded-3xl border border-line bg-white p-5" id={sectionId}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {canAddToCart ? (
          <>
            <AddToCartButton slug={product.slug} />
            <Button href="/cart" variant="secondary">
              Открыть корзину
            </Button>
          </>
        ) : null}

        {isDirectSaleProduct(product) && !canAddToCart ? (
          <Button onClick={() => openModal({ ...buyCopy, source: `product-buy:${product.name}`, productName: product.name })}>
            {hasFixedPrice ? "Купить без корзины" : "Запросить покупку"}
          </Button>
        ) : null}

        {isMarketplaceProduct(product) && hasMarketplaceUrl && marketplaceHref ? (
          <a
            href={marketplaceHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-accent bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent-hover hover:bg-accent-hover"
          >
            Купить на Ozon
          </a>
        ) : null}

        {isMarketplaceProduct(product) && !hasMarketplaceUrl ? (
          <Button onClick={() => openModal({ ...marketplaceCopy, source: `product-marketplace:${product.name}`, productName: product.name })}>
            Уточнить, где купить
          </Button>
        ) : null}

        <Button onClick={() => openModal({ ...questionCopy, source: `product-question:${product.name}`, productName: product.name })} variant="secondary">
          {isMarketplaceProduct(product) ? "Уточнить по товару" : "Задать вопрос"}
        </Button>

        {!isDirectSaleProduct(product) ? (
          <Button onClick={() => openModal({ ...requestCopy, source: `product:${product.name}`, productName: product.name })} variant="ghost">
            {isMarketplaceProduct(product) ? "Подобрать аналог" : "Оставить заявку"}
          </Button>
        ) : null}
      </div>

      <div className="mt-3 grid gap-1 text-sm leading-6 text-body">
        {isDirectSaleProduct(product) ? (
          <>
            <p>{cartStatusMessage}</p>
            <p>Способы получения: {deliverySummary.methodLabels}.</p>
            <p>{deliverySummary.commercialSummary}</p>
          </>
        ) : null}
        {isMarketplaceProduct(product) ? (
          <p>Для этой позиции прямой заказ на сайте не является основным потоком. Если ссылки на Ozon нет, через форму можно уточнить актуальный канал покупки.</p>
        ) : null}
        {!isDirectSaleProduct(product) && !isMarketplaceProduct(product) ? (
          <p>Для этой позиции сначала собираем параметры задачи, после чего подтверждаем возможность изготовления или подбора.</p>
        ) : null}
      </div>
    </div>
  );
}
