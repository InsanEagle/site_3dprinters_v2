"use client";

import { Button } from "@/components/ui/button";
import { useRequestModal } from "@/components/shared/request-modal";

export function ProductActions({ productName }: { productName: string }) {
  const { openModal } = useRequestModal();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={() =>
          openModal({
            title: "Оставить заявку по товару",
            source: `product:${productName}`,
            productName
          })
        }
      >
        Оставить заявку
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          openModal({
            title: "Задать вопрос по товару",
            source: `product-question:${productName}`,
            productName
          })
        }
      >
        Задать вопрос
      </Button>
    </div>
  );
}

