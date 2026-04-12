"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24">
      <StatePanel
        eyebrow="Ошибка"
        title="Не удалось открыть страницу"
        description="Похоже, произошла временная ошибка загрузки или рендера. Можно попробовать открыть страницу еще раз или перейти в стабильный раздел сайта."
        actions={
          <>
            <Button type="button" onClick={() => reset()}>
              Попробовать снова
            </Button>
            <Button href="/catalog" variant="secondary">
              Открыть каталог
            </Button>
          </>
        }
      />
    </div>
  );
}
