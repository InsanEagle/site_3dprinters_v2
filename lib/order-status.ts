import { createHash, timingSafeEqual } from "node:crypto";
import { OrderRecord, OrderStatus } from "@/lib/order-submission";
import { isProductionEnvironment, readEnvText } from "@/lib/runtime-env";

const DEV_ORDER_ACCESS_SECRET = "order-status-dev-only";

function normalizeText(value: string | undefined) {
  return value?.trim() || "";
}

export function getOrderAccessConfig() {
  const secret = readEnvText("ORDER_PUBLIC_ACCESS_SECRET");
  const isProduction = isProductionEnvironment();
  const enabled = Boolean(secret) || !isProduction;

  return {
    enabled,
    isProduction,
    isMisconfigured: isProduction && !secret,
    secret: secret || DEV_ORDER_ACCESS_SECRET,
    missing: isProduction && !secret ? ["ORDER_PUBLIC_ACCESS_SECRET"] : []
  };
}

function createOrderAccessDigest(orderId: string, orderNumber: string) {
  const config = getOrderAccessConfig();

  if (!config.enabled) {
    const details = config.missing.length ? ` Missing env: ${config.missing.join(", ")}.` : "";
    throw new Error(`Public order access is not configured.${details}`);
  }

  return createHash("sha256").update(`${orderId}:${orderNumber}:${config.secret}`).digest("hex").slice(0, 24);
}

export function createOrderAccessToken(order: Pick<OrderRecord, "id" | "orderNumber">) {
  return createOrderAccessDigest(order.id, order.orderNumber);
}

export function hasOrderPublicAccess(order: Pick<OrderRecord, "id" | "orderNumber">, candidate: string | undefined) {
  const config = getOrderAccessConfig();

  if (!config.enabled) {
    return false;
  }

  const expected = createOrderAccessToken(order);
  const actual = normalizeText(candidate);

  if (!actual || actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function getPublicOrderStatusHref(order: Pick<OrderRecord, "id" | "orderNumber">) {
  const access = createOrderAccessToken(order);
  const appUrl = readEnvText("APP_URL")?.replace(/\/+$/, "");
  const relativePath = `/orders/${encodeURIComponent(order.id)}?access=${encodeURIComponent(access)}`;

  return appUrl ? `${appUrl}${relativePath}` : relativePath;
}

const buyerStatusMeta: Record<
  OrderStatus,
  {
    label: string;
    tone: string;
    description: string;
    nextStep: string;
  }
> = {
  new: {
    label: "Получен",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    description: "Заказ сохранен и ждет первого подтверждения со стороны менеджера.",
    nextStep: "Следующий шаг: мы сверим состав заказа, способ получения и вернемся с подтверждением деталей."
  },
  confirmed: {
    label: "Подтвержден",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
    description: "Мы подтвердили заказ и согласовали базовые условия обработки.",
    nextStep: "Следующий шаг: заказ переходит в работу, а по срокам и выдаче мы держим вас в курсе напрямую."
  },
  processing: {
    label: "В работе",
    tone: "border-violet-200 bg-violet-50 text-violet-800",
    description: "Заказ уже находится в производстве, сборке или ручной подготовке к передаче.",
    nextStep: "Следующий шаг: дождаться завершения работ и отдельного сообщения о готовности или передаче."
  },
  completed: {
    label: "Завершен",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    description: "Заказ закрыт: выдан, доставлен или завершен без дополнительных действий.",
    nextStep: "Следующий шаг не требуется. Если нужна повторная партия или уточнение, можно написать через контакты."
  },
  cancelled: {
    label: "Отменен",
    tone: "border-rose-200 bg-rose-50 text-rose-800",
    description: "Заказ остановлен и больше не находится в активной обработке.",
    nextStep: "Если нужно заново обсудить задачу или оформить новый заказ, лучше начать через контакты."
  }
};

export function getBuyerOrderStatusMeta(status: OrderStatus) {
  return buyerStatusMeta[status];
}

export function getBuyerNotificationNote(order: Pick<OrderRecord, "managerNotification" | "status">) {
  if (order.managerNotification.status === "delivery_failed") {
    return "Заказ сохранен, но автоматическое уведомление менеджеру прошло с ошибкой. Если подтверждение долго не приходит, лучше написать нам через контакты.";
  }

  if (order.managerNotification.status === "pending_delivery") {
    return "Заказ уже сохранен во внутренней системе. Если доставка уведомления менеджеру еще не завершилась, повторная отправка выполняется без потери заказа.";
  }

  if (order.status === "new") {
    return "Менеджер уже получил заказ и должен вернуться с подтверждением следующего шага вручную.";
  }

  return "Статус на странице обновляется из текущего order-layer, без отдельного кабинета и без изменения состава заказа.";
}
