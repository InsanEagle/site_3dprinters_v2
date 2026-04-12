import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { formContent, thanksContent } from "@/data/content";
import { DeliveryMethod } from "@/lib/delivery";

export const metadata: Metadata = {
  title: "Спасибо за обращение | Изготовление деталей",
  description: thanksContent.text
};

export default async function ThanksPage({
  searchParams
}: {
  searchParams: Promise<{ source?: string; kind?: string; orderNumber?: string; deliveryMethod?: DeliveryMethod }>;
}) {
  const { source, kind, orderNumber, deliveryMethod } = await searchParams;
  const isOrderFlow = kind === "order";
  const eyebrow = isOrderFlow ? "Заказ отправлен" : formContent.successTitle;
  const title = isOrderFlow ? "Спасибо, заказ принят в обработку" : thanksContent.title;
  const text = isOrderFlow
    ? "Мы приняли заказ в обработку, зафиксировали его состав и передали менеджеру данные для ручного подтверждения следующего шага. Автоматические этапы отслеживания на этом этапе еще не подключены."
    : thanksContent.text;
  const deliveryCopy =
    deliveryMethod === "pickup"
      ? "Самовывоз и детали передачи менеджер подтвердит вручную."
      : deliveryMethod === "delivery"
        ? "Стоимость и детали доставки менеджер подтвердит вручную после проверки заказа."
        : null;

  return (
    <div className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-line bg-surface p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-4 text-base leading-7 text-body sm:text-lg">{text}</p>
          {orderNumber ? <p className="mt-4 text-sm text-body">Номер заказа: {orderNumber}</p> : null}
          {deliveryCopy ? <p className="mt-2 text-sm text-body">Способ получения: {deliveryCopy}</p> : null}
          {source ? <p className="mt-4 text-sm text-body">Источник обращения: {source}</p> : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/">На главную</Button>
            <Button href="/catalog" variant="secondary">
              Смотреть каталог
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
