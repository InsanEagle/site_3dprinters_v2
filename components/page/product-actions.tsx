"use client";

import { Button } from "@/components/ui/button";
import { useRequestModal } from "@/components/shared/request-modal";
import {
  getBuyFallbackFormText,
  getProductQuestionFormText,
  getProductRequestFormText
} from "@/lib/request-ui";

export function ProductActions({ productName }: { productName: string }) {
  const { openModal } = useRequestModal();
  const requestCopy = getProductRequestFormText(productName);
  const questionCopy = getProductQuestionFormText(productName);
  const buyCopy = getBuyFallbackFormText(productName);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={() => openModal({ ...requestCopy, source: `product:${productName}`, productName })}>
          Оставить заявку
        </Button>
        <Button onClick={() => openModal({ ...questionCopy, source: `product-question:${productName}`, productName })} variant="secondary">
          Задать вопрос
        </Button>
        <Button onClick={() => openModal({ ...buyCopy, source: `product-buy:${productName}`, productName })} variant="ghost">
          Купить
        </Button>
      </div>
      <div className="mt-3 grid gap-1 text-sm leading-6 text-body">
        <p>Оставить заявку: если нужна оценка, похожая позиция или изготовление под задачу.</p>
        <p>Задать вопрос: если нужно уточнить детали по товару до следующего шага.</p>
        <p>Купить: честный временный fallback, пока прямой checkout еще не подключен.</p>
      </div>
    </div>
  );
}
