import Link from "next/link";
import { ORDER_STATUSES, OrderStatus } from "@/lib/order-submission";
import { listOrderRecords } from "@/lib/orders-store";
import {
  formatOrderDate,
  formatOrderMoney,
  getInternalOrdersOverview,
  getNotificationStatusMeta,
  getOrderCustomerSummary,
  getOrderDeliverySummary,
  getOrderItemsCount,
  getOrderStatusMeta
} from "@/lib/order-backoffice";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InternalOrdersPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string; error?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedStatus =
    typeof resolvedSearchParams.status === "string" && ORDER_STATUSES.includes(resolvedSearchParams.status as OrderStatus)
      ? (resolvedSearchParams.status as OrderStatus)
      : undefined;
  const records = await listOrderRecords();
  const filteredRecords = selectedStatus ? records.filter((record) => record.status === selectedStatus) : records;
  const overview = getInternalOrdersOverview(records);

  return (
    <div className="space-y-6" data-testid="internal-orders-page">
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <article className="rounded-[28px] border border-line bg-surface p-5 xl:col-span-1">
          <p className="text-sm text-body">Всего заказов</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{overview.total}</p>
        </article>
        {ORDER_STATUSES.map((status) => {
          const meta = getOrderStatusMeta(status);
          const isActive = selectedStatus === status;

          return (
            <Link
              key={status}
              href={`/internal/orders?status=${status}`}
              className={cn(
                "rounded-[28px] border p-5 transition",
                isActive ? "border-accent bg-white" : "border-line bg-white hover:border-accent"
              )}
            >
              <p className="text-sm text-body">{meta.label}</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{overview.byStatus[status]}</p>
            </Link>
          );
        })}
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Link
          href="/internal/orders"
          className={cn(
            "inline-flex rounded-full border px-4 py-2 text-sm font-medium transition",
            selectedStatus ? "border-line bg-white text-body hover:border-accent hover:text-ink" : "border-accent bg-accent text-white"
          )}
        >
          Все
        </Link>
        {ORDER_STATUSES.map((status) => {
          const meta = getOrderStatusMeta(status);

          return (
            <Link
              key={status}
              href={`/internal/orders?status=${status}`}
              className={cn(
                "inline-flex rounded-full border px-4 py-2 text-sm font-medium transition",
                selectedStatus === status
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-body hover:border-accent hover:text-ink"
              )}
            >
              {meta.label}
            </Link>
          );
        })}
      </section>

      {resolvedSearchParams.error === "not-found" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          Заказ не найден. Возможно, файл был удален или идентификатор изменился.
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[32px] border border-line bg-white">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr] gap-4 border-b border-line bg-surface px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-body lg:grid">
          <span>Заказ</span>
          <span>Клиент</span>
          <span>Статус</span>
          <span>Сумма</span>
          <span>Доставка</span>
        </div>

        {filteredRecords.length ? (
          filteredRecords.map((record) => {
            const status = getOrderStatusMeta(record.status);
            const notification = getNotificationStatusMeta(record.managerNotification.status);

            return (
              <Link
                key={record.id}
                href={`/internal/orders/${record.id}`}
                data-testid={`internal-order-row-${record.id}`}
                className="grid grid-cols-1 gap-4 border-b border-line px-6 py-5 transition last:border-b-0 hover:bg-surface/70 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr]"
              >
                <div>
                  <p className="text-base font-semibold text-ink">{record.orderNumber}</p>
                  <p className="mt-1 text-sm text-body">{formatOrderDate(record.createdAt)}</p>
                  <p className="mt-2 text-sm text-body">
                    {getOrderItemsCount(record)} поз. • {record.items.map((item) => item.name).join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm leading-6 text-ink">{getOrderCustomerSummary(record)}</p>
                </div>
                <div className="space-y-2">
                  <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", status.tone)}>{status.label}</span>
                  <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", notification.tone)}>
                    {notification.label}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{formatOrderMoney(record.subtotal)}</p>
                  <p className="mt-1 text-sm text-body">{record.currency}</p>
                </div>
                <div>
                  <p className="text-sm leading-6 text-ink">{getOrderDeliverySummary(record)}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="px-6 py-12 text-sm leading-6 text-body">
            Для выбранного статуса пока нет заказов. Попробуйте снять фильтр или оформить новый direct-order.
          </div>
        )}
      </section>
    </div>
  );
}
