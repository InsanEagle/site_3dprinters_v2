import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  formatOrderDate,
  formatOrderMoney,
  getOrderDeliverySummary,
  getOrderItemsCount
} from "@/lib/order-backoffice";
import { findOrderRecord } from "@/lib/orders-store";
import { getBuyerNotificationNote, getBuyerOrderStatusMeta, hasOrderPublicAccess } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Статус заказа",
  description: "Публичная страница статуса заказа по безопасной ссылке."
};

export default async function PublicOrderStatusPage({
  params,
  searchParams
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ access?: string }>;
}) {
  const { orderId } = await params;
  const { access } = await searchParams;
  const order = await findOrderRecord(orderId);

  if (!order || !hasOrderPublicAccess(order, access)) {
    notFound();
  }

  const statusMeta = getBuyerOrderStatusMeta(order.status);
  const notificationNote = getBuyerNotificationNote(order);
  const deliverySummary = getOrderDeliverySummary(order);

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-5xl space-y-6" data-testid="public-order-status-page">
          <section className="rounded-[32px] border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Статус заказа</p>
                <h1 data-testid="public-order-number" className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{order.orderNumber}</h1>
                <p className="mt-3 text-sm leading-6 text-body">
                  Создан {formatOrderDate(order.createdAt)} • обновлен {formatOrderDate(order.updatedAt)}
                </p>
              </div>

              <div className="space-y-3 lg:max-w-sm">
                <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", statusMeta.tone)}>
                  {statusMeta.label}
                </span>
                <div className="rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
                  <p>{statusMeta.description}</p>
                  <p className="mt-2 font-medium text-ink">{statusMeta.nextStep}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <article className="rounded-[32px] border border-line bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Состав заказа</h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    Это snapshot на момент оформления: состав и цены здесь больше не пересчитываются от текущего каталога.
                  </p>
                </div>
                <p className="text-sm text-body">{getOrderItemsCount(order)} шт.</p>
              </div>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-line">
                <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] gap-4 bg-surface px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-body">
                  <span>Позиция</span>
                  <span>Цена</span>
                  <span>Кол-во</span>
                  <span>Сумма</span>
                </div>
                {order.items.map((item) => (
                  <div
                    key={`${item.orderId}-${item.productSlug}`}
                    className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] gap-4 border-t border-line px-5 py-4 text-sm leading-6 text-ink"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-body">{item.sku ? `SKU: ${item.sku}` : item.productSlug}</p>
                    </div>
                    <span>{formatOrderMoney(item.unitPrice)}</span>
                    <span>{item.quantity}</span>
                    <span>{formatOrderMoney(item.lineTotal)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-line bg-surface px-5 py-4">
                  <span className="text-sm font-medium text-body">Subtotal</span>
                  <span className="text-lg font-semibold text-ink">{formatOrderMoney(order.subtotal)}</span>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-[32px] border border-line bg-white p-6">
                <h2 className="text-xl font-semibold text-ink">Получение</h2>
                <div className="mt-4 space-y-3 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
                  <p>{deliverySummary}</p>
                  <p>{order.deliveryNote}</p>
                  <p>{order.commercialNote}</p>
                </div>
              </article>

              <article className="rounded-[32px] border border-line bg-white p-6">
                <h2 className="text-xl font-semibold text-ink">Что дальше</h2>
                <div className="mt-4 space-y-3 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
                  <p>{notificationNote}</p>
                  <p>{order.fulfillmentNote}</p>
                  <p>Если ссылка потеряется, на этом этапе восстановление доступа пока делаем вручную через контакты, без отдельного кабинета покупателя.</p>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <Button href="/contacts">Связаться по заказу</Button>
                  <Button href="/catalog" variant="secondary">
                    Вернуться в каталог
                  </Button>
                  <Link href="/" className="text-sm font-medium text-accent transition hover:text-accent-hover">
                    На главную
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
