import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

export default function NotFound() {
  return (
    <div className="py-24">
      <StatePanel
        eyebrow="404"
        title="Страница не найдена"
        description="Такой страницы, категории или товара сейчас нет. Можно вернуться в каталог и продолжить просмотр оттуда."
        actions={
          <>
            <Button href="/catalog">Перейти в каталог</Button>
            <Button href="/" variant="secondary">
              На главную
            </Button>
          </>
        }
      />
    </div>
  );
}
