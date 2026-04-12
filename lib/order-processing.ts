import { randomBytes, randomUUID } from "crypto";
import {
  OrderCustomerDetails,
  OrderDeliveryMethod,
  OrderLineItemInput,
  OrderRecord,
  OrderSubmissionResponse,
  OrderWebhookEvent,
  orderValidationMessages
} from "@/lib/order-submission";
import { deliverJsonWebhook, getWebhookDeliveryConfig } from "@/lib/webhook-delivery";

function formatDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function createOrderNumber(date: Date) {
  const datePart = `${date.getUTCFullYear()}${formatDatePart(date.getUTCMonth() + 1)}${formatDatePart(date.getUTCDate())}`;
  const timePart = `${formatDatePart(date.getUTCHours())}${formatDatePart(date.getUTCMinutes())}${formatDatePart(date.getUTCSeconds())}`;
  const suffix = randomBytes(2).toString("hex").toUpperCase();

  return `ORD-${datePart}-${timePart}-${suffix}`;
}

export function createOrderRecord(args: {
  source: string;
  customer: OrderCustomerDetails;
  delivery: {
    method: OrderDeliveryMethod;
    label: string;
    note: string;
    fee?: number;
    commercialNote: string;
    fulfillmentNote: string;
  };
  items: OrderLineItemInput[];
  subtotal: number;
}): OrderRecord {
  const now = new Date();
  const timestamp = now.toISOString();
  const id = randomUUID();

  return {
    id,
    orderNumber: createOrderNumber(now),
    status: "new",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: args.source,
    customerName: args.customer.name,
    customerContact: args.customer.contact,
    city: args.customer.city,
    address: args.customer.address,
    deliveryMethod: args.delivery.method,
    deliveryLabel: args.delivery.label,
    deliveryNote: args.delivery.note,
    deliveryFee: args.delivery.fee,
    comment: args.customer.comment,
    subtotal: args.subtotal,
    currency: "RUB",
    commercialNote: args.delivery.commercialNote,
    fulfillmentNote: args.delivery.fulfillmentNote,
    items: args.items.map((item) => ({
      ...item,
      orderId: id
    })),
    managerNotification: {
      channel: "webhook",
      status: "pending"
    }
  };
}

export function markOrderNotificationDelivered(record: OrderRecord): OrderRecord {
  const deliveredAt = new Date().toISOString();

  return {
    ...record,
    updatedAt: deliveredAt,
    managerNotification: {
      channel: "webhook",
      status: "delivered",
      deliveredAt
    }
  };
}

export function markOrderNotificationFailed(record: OrderRecord, message: string): OrderRecord {
  return {
    ...record,
    updatedAt: new Date().toISOString(),
    managerNotification: {
      channel: "webhook",
      status: "failed",
      lastError: message
    }
  };
}

export async function submitOrderSubmission(record: OrderRecord): Promise<OrderSubmissionResponse> {
  const availability = getWebhookDeliveryConfig();

  if (!availability.isConfigured) {
    return {
      ok: false,
      code: "submission_unavailable",
      message: `${orderValidationMessages.formUnavailable} Заказ ${record.orderNumber} уже сохранен, но менеджер не получил автоматическое уведомление.`,
      orderId: record.id,
      orderNumber: record.orderNumber
    };
  }

  const event: OrderWebhookEvent = {
    event: "order.created",
    orderId: record.id,
    orderNumber: record.orderNumber,
    createdAt: record.createdAt,
    payload: record,
    meta: {
      channel: "webhook",
      site: availability.siteName
    }
  };

  const response = await deliverJsonWebhook({
    eventName: event.event,
    requestId: event.orderId,
    body: event,
    config: availability
  });

  if (response.ok) {
    return {
      ok: true,
      message: orderValidationMessages.success,
      orderId: record.id,
      orderNumber: record.orderNumber,
      redirectTo: `/thanks?source=${encodeURIComponent(record.source)}&kind=order&orderNumber=${encodeURIComponent(record.orderNumber)}&deliveryMethod=${encodeURIComponent(record.deliveryMethod)}`
    };
  }

  return {
    ok: false,
    code: "delivery_failed",
    message:
      response.status && response.status !== 502
        ? `${orderValidationMessages.deliveryFailed} Заказ ${record.orderNumber} сохранен, но канал вернул статус ${response.status}.`
        : `${orderValidationMessages.deliveryFailed} Заказ ${record.orderNumber} сохранен, но канал недоступен.`,
    orderId: record.id,
    orderNumber: record.orderNumber
  };
}
