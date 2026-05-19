import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { formContent, thanksContent } from "@/data/content";
import { DeliveryMethod } from "@/lib/delivery";
import { OrderNotificationStatus } from "@/lib/order-submission";
import { getPublicOrderStatusHref, hasOrderPublicAccess } from "@/lib/order-status";

export const metadata: Metadata = {
  title: "Спасибо за обращение | Изготовление деталей",
  description: thanksContent.text
};

function getOrderFlowCopy(deliveryStatus: OrderNotificationStatus | undefined) {
  if (deliveryStatus === "delivered") {
    return {
      eyebrow: "Заказ отправлен",
      title: "Спасибо, заказ сохранен и передан в обработку",
      text: "Мы приняли заказ, зафиксировали его состав и передали данные менеджеру для ручного подтверждения следующего шага. Проверить статус можно по защищенной ссылке без отдельной регистрации."
    };
  }

  return {
    eyebrow: "Заказ сохранен",
    title: "Спасибо, заказ надежно сохранен",
    text: "Заказ уже зафиксирован во внутренней системе. Автоматическая передача менеджеру пока не подтвердилась, но заказ не потерян: его можно повторно доставить из внутреннего слоя без нового оформления."
  };
}

export default async function ThanksPage({
  searchParams
}: {
  searchParams: Promise<{
    source?: string;
    kind?: string;
    orderNumber?: string;
    orderId?: string;
    access?: string;
    deliveryMethod?: DeliveryMethod;
    deliveryStatus?: OrderNotificationStatus;
  }>;
}) {
  const { source, kind, orderNumber, orderId, access, deliveryMethod, deliveryStatus } = await searchParams;
  const isOrderFlow = kind === "order";
  const orderCopy = getOrderFlowCopy(deliveryStatus);
  const eyebrow = isOrderFlow ? orderCopy.eyebrow : formContent.successTitle;
  const title = isOrderFlow ? orderCopy.title : thanksContent.title;
  const text = isOrderFlow ? orderCopy.text : thanksContent.text;
  const deliveryCopy =
    deliveryMethod === "pickup"
      ? "Самовывоз и детали передачи менеджер подтвердит вручную."
      : deliveryMethod === "delivery"
        ? "Стоимость и детали доставки менеджер подтвердит вручную после проверки заказа."
        : null;
  const hasStatusAccess = Boolean(orderId && orderNumber && hasOrderPublicAccess({ id: orderId, orderNumber }, access));
  const statusHref = hasStatusAccess ? getPublicOrderStatusHref({ id: orderId as string, orderNumber: orderNumber as string }) : undefined;

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
          {statusHref ? (
            <p className="mt-4 text-sm text-body">
              Сохраните эту ссылку: она откроет текущий статус заказа позже без отдельной регистрации.
            </p>
          ) : isOrderFlow ? (
            <p className="mt-4 text-sm text-body">
              Публичная ссылка статуса может быть недоступна, если в окружении не настроен отдельный секрет для order access.
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {statusHref ? <Button href={statusHref}>Открыть статус заказа</Button> : null}
            <Button href="/">На главную</Button>
            <Button href="/catalog" variant="secondary">
              Открыть каталог
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
