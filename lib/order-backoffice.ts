import { ORDER_STATUSES, OrderNotificationStatus, OrderRecord, OrderStatus } from "@/lib/order-submission";

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short"
});

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    tone: string;
    description: string;
  }
> = {
  new: {
    label: "Новый",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    description: "Новый заказ, который еще не подтвержден менеджером."
  },
  confirmed: {
    label: "Подтвержден",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
    description: "Менеджер связался с клиентом и подтвердил условия."
  },
  processing: {
    label: "В работе",
    tone: "border-violet-200 bg-violet-50 text-violet-800",
    description: "Заказ находится в производстве или ручной обработке."
  },
  completed: {
    label: "Завершен",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    description: "Заказ выдан или закрыт без дополнительных действий."
  },
  cancelled: {
    label: "Отменен",
    tone: "border-rose-200 bg-rose-50 text-rose-800",
    description: "Заказ остановлен и больше не требует обработки."
  }
};

const notificationMeta: Record<
  OrderNotificationStatus,
  {
    label: string;
    tone: string;
  }
> = {
  pending_delivery: {
    label: "Ожидает доставки",
    tone: "border-amber-200 bg-amber-50 text-amber-800"
  },
  delivered: {
    label: "Доставлено",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800"
  },
  delivery_failed: {
    label: "Ошибка доставки",
    tone: "border-rose-200 bg-rose-50 text-rose-800"
  }
};

export function getOrderStatusOptions() {
  return ORDER_STATUSES.map((status) => ({
    value: status,
    ...statusMeta[status]
  }));
}

export function getOrderStatusMeta(status: OrderStatus) {
  return statusMeta[status];
}

export function getNotificationStatusMeta(status: OrderNotificationStatus) {
  return notificationMeta[status];
}

export function formatOrderDate(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatOrderMoney(value: number) {
  return moneyFormatter.format(value);
}

export function getOrderCustomerSummary(order: OrderRecord) {
  return [order.customerName, order.customerContact, order.city].filter(Boolean).join(" • ");
}

export function getOrderDeliverySummary(order: OrderRecord) {
  return [order.deliveryLabel, order.deliveryFee ? formatOrderMoney(order.deliveryFee) : "стоимость уточняется вручную"]
    .filter(Boolean)
    .join(" • ");
}

export function getOrderItemsCount(order: OrderRecord) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function getInternalOrdersOverview(records: OrderRecord[]) {
  const counters = ORDER_STATUSES.reduce<Record<OrderStatus, number>>(
    (accumulator, status) => {
      accumulator[status] = 0;
      return accumulator;
    },
    {} as Record<OrderStatus, number>
  );

  for (const record of records) {
    counters[record.status] += 1;
  }

  return {
    total: records.length,
    byStatus: counters
  };
}
