import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { findOrderRecord } from "@/lib/orders-store";
import {
  formatOrderDate,
  formatOrderMoney,
  getNotificationStatusMeta,
  getOrderCustomerSummary,
  getOrderStatusMeta,
  getOrderStatusOptions
} from "@/lib/order-backoffice";
import { getOrderAccessConfig, getPublicOrderStatusHref } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { retryOrderDeliveryAction, updateOrderStatusAction } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getContactHref(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.includes("@")) {
    return `mailto:${trimmedValue}`;
  }

  const digits = trimmedValue.replace(/[^\d+]/g, "");

  return digits ? `tel:${digits}` : undefined;
}

export default async function InternalOrderDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ orderId: string }>;
  searchParams?: Promise<{ updated?: string; error?: string; deliveryRetried?: string }>;
}) {
  const { orderId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const record = await findOrderRecord(orderId);

  if (!record) {
    notFound();
  }

  const statusMeta = getOrderStatusMeta(record.status);
  const notificationMeta = getNotificationStatusMeta(record.managerNotification.status);
  const contactHref = getContactHref(record.customerContact);
  const publicAccessConfig = getOrderAccessConfig();
  const publicStatusHref = publicAccessConfig.enabled ? getPublicOrderStatusHref(record) : null;
  const canRetryDelivery = record.managerNotification.status !== "delivered";

  return (
    <div className="space-y-6" data-testid="internal-order-details">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/internal/orders" className="inline-flex text-sm font-medium text-accent transition hover:text-accent-hover">
          К списку заказов
        </Link>
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", statusMeta.tone)}>{statusMeta.label}</span>
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", notificationMeta.tone)}>
          {notificationMeta.label}
        </span>
      </div>

      {resolvedSearchParams.updated === "1" ? (
        <div data-testid="internal-order-updated" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          Статус заказа обновлен и сохранен.
        </div>
      ) : null}

      {resolvedSearchParams.deliveryRetried === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          Повторная доставка заказа выполнена. Текущий delivery-статус обновлен по последней попытке.
        </div>
      ) : null}

      {resolvedSearchParams.error === "invalid-status" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          Не удалось обновить статус. Попробуйте выбрать одно из поддерживаемых значений.
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-[32px] border border-line bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Заказ</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink">{record.orderNumber}</h2>
              <p className="mt-3 text-sm leading-6 text-body">
                Создан {formatOrderDate(record.createdAt)} • Обновлен {formatOrderDate(record.updatedAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-body">
              <p>{getOrderCustomerSummary(record)}</p>
              <p>Источник: {record.source}</p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-line">
            <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] gap-4 bg-surface px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-body">
              <span>Позиция</span>
              <span>Цена</span>
              <span>Кол-во</span>
              <span>Сумма</span>
            </div>
            {record.items.map((item) => (
              <div key={`${item.orderId}-${item.productSlug}`} className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] gap-4 border-t border-line px-5 py-4 text-sm leading-6 text-ink">
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
              <span className="text-sm font-medium text-body">Subtotal snapshot</span>
              <span className="text-lg font-semibold text-ink">{formatOrderMoney(record.subtotal)}</span>
            </div>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[32px] border border-line bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Статус и действия</h2>
            <p className="mt-3 text-sm leading-6 text-body">{statusMeta.description}</p>
            <form action={updateOrderStatusAction} data-testid="internal-order-status-form" className="mt-6 space-y-4">
              <input type="hidden" name="orderId" value={record.id} />
              <label className="block text-sm font-medium text-ink" htmlFor="status">
                Новый статус
              </label>
              <select
                id="status"
                name="status"
                data-testid="internal-order-status-select"
                defaultValue={record.status}
                className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
              >
                {getOrderStatusOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full" data-testid="internal-order-status-submit">
                Сохранить статус
              </Button>
            </form>

            <div className="mt-6 space-y-3 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
              {contactHref ? (
                <a href={contactHref} className="inline-flex font-medium text-accent transition hover:text-accent-hover">
                  Связаться с клиентом
                </a>
              ) : (
                <p>Контакт для связи: {record.customerContact}</p>
              )}
              <p>{record.deliveryLabel}</p>
              <p>{record.deliveryNote}</p>
            </div>
          </article>

          <article className="rounded-[32px] border border-line bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">История заказа</h2>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-medium text-ink">Клиент</dt>
                <dd className="text-body">{record.customerName}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Контакт</dt>
                <dd className="text-body">{record.customerContact}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Город</dt>
                <dd className="text-body">{record.city}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Адрес / ориентир</dt>
                <dd className="text-body">{record.address || "Не указан"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Комментарий клиента</dt>
                <dd className="text-body">{record.comment || "Нет комментария"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Commercial note</dt>
                <dd className="text-body">{record.commercialNote}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Fulfillment note</dt>
                <dd className="text-body">{record.fulfillmentNote}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[32px] border border-line bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Уведомление менеджеру</h2>
            <div className="mt-4 space-y-3 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
              <p>Канал: {record.managerNotification.channel}</p>
              <p>Статус: {notificationMeta.label}</p>
              <p>Тип последней попытки: {record.managerNotification.deliveryTrigger === "retry" ? "Повторная доставка" : "Первичная доставка"}</p>
              <p>Попыток: {record.managerNotification.attemptCount}</p>
              <p>Последняя попытка: {record.managerNotification.lastAttemptAt ? formatOrderDate(record.managerNotification.lastAttemptAt) : "Пока нет"}</p>
              <p>Доставлено: {record.managerNotification.deliveredAt ? formatOrderDate(record.managerNotification.deliveredAt) : "Пока нет"}</p>
              <p>Последняя ошибка: {record.managerNotification.lastError || "Нет"}</p>

              {record.managerNotification.channels?.length ? (
                <div className="space-y-2 border-t border-line pt-3">
                  <p className="font-medium text-ink">Каналы fan-out</p>
                  <ul className="space-y-2">
                    {record.managerNotification.channels.map((channel) => (
                      <li key={channel.name} className="rounded-xl border border-line bg-white px-3 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-ink">{channel.label}</span>
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                              channel.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
                            )}
                          >
                            {channel.ok ? "Доставлено" : "Ошибка"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-body">
                          {channel.required ? "Основной канал" : "Дополнительный канал"} • HTTP {channel.status}
                        </p>
                        {channel.lastError ? <p className="mt-1 text-xs text-rose-700">{channel.lastError}</p> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {publicStatusHref ? (
                <a href={publicStatusHref} data-testid="internal-order-public-link" className="inline-flex font-medium text-accent transition hover:text-accent-hover">
                  Открыть публичную ссылку статуса
                </a>
              ) : (
                <p>Публичная ссылка статуса недоступна: в окружении не настроен ORDER_PUBLIC_ACCESS_SECRET.</p>
              )}
            </div>
            {canRetryDelivery ? (
              <form action={retryOrderDeliveryAction} className="mt-4">
                <input type="hidden" name="orderId" value={record.id} />
                <Button type="submit" variant="secondary" data-testid="internal-order-retry-delivery">
                  Повторить доставку менеджеру
                </Button>
              </form>
            ) : null}
          </article>
        </div>
      </section>
    </div>
  );
}
