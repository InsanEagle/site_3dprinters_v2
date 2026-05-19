import { createHash, randomBytes, randomUUID } from "crypto";
import {
  OrderCustomerDetails,
  OrderDeliveryMethod,
  OrderLineItemInput,
  OrderNotificationChannelState,
  OrderNotificationDeliveryTrigger,
  OrderNotificationStatus,
  OrderRecord,
  OrderSubmissionPayload,
  OrderSubmissionResponse,
  OrderWebhookEvent,
  orderValidationMessages
} from "@/lib/order-submission";
import { OperationsChannelResult, deliverOperationsEvent, getOperationsNotificationConfig } from "@/lib/operations-notifications";
import { createOrderAccessToken, getOrderAccessConfig, getPublicOrderStatusHref } from "@/lib/order-status";

function formatDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function createOrderNumber(date: Date) {
  const datePart = `${date.getUTCFullYear()}${formatDatePart(date.getUTCMonth() + 1)}${formatDatePart(date.getUTCDate())}`;
  const timePart = `${formatDatePart(date.getUTCHours())}${formatDatePart(date.getUTCMinutes())}${formatDatePart(date.getUTCSeconds())}`;
  const suffix = randomBytes(2).toString("hex").toUpperCase();

  return `ORD-${datePart}-${timePart}-${suffix}`;
}

export function createOrderSubmissionFingerprint(payload: OrderSubmissionPayload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
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
  idempotencyKey?: string;
  submissionFingerprint?: string;
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
    idempotencyKey: args.idempotencyKey,
    submissionFingerprint: args.submissionFingerprint,
    items: args.items.map((item) => ({
      ...item,
      orderId: id
    })),
    managerNotification: {
      channel: "webhook",
      status: "pending_delivery",
      deliveryTrigger: "initial",
      attemptCount: 0
    }
  };
}

function mapChannelResultsToState(results: OperationsChannelResult[]): OrderNotificationChannelState[] {
  const deliveredAt = new Date().toISOString();

  return results.map((result) => ({
    name: result.name,
    label: result.label,
    required: result.required,
    configured: result.configured,
    ok: result.ok,
    status: result.status,
    deliveredAt: result.ok ? deliveredAt : undefined,
    lastError: result.ok ? undefined : result.error
  }));
}

export function startOrderNotificationAttempt(record: OrderRecord, deliveryTrigger: OrderNotificationDeliveryTrigger): OrderRecord {
  const attemptedAt = new Date().toISOString();

  return {
    ...record,
    updatedAt: attemptedAt,
    managerNotification: {
      ...record.managerNotification,
      status: "pending_delivery",
      deliveryTrigger,
      attemptCount: record.managerNotification.attemptCount + 1,
      lastAttemptAt: attemptedAt,
      lastError: undefined
    }
  };
}

export function markOrderNotificationDelivered(record: OrderRecord, channels?: OrderNotificationChannelState[]): OrderRecord {
  const deliveredAt = new Date().toISOString();

  return {
    ...record,
    updatedAt: deliveredAt,
    managerNotification: {
      ...record.managerNotification,
      status: "delivered",
      deliveredAt,
      lastAttemptAt: record.managerNotification.lastAttemptAt ?? deliveredAt,
      lastError: undefined,
      channels
    }
  };
}

export function markOrderNotificationFailed(record: OrderRecord, message: string, channels?: OrderNotificationChannelState[]): OrderRecord {
  return {
    ...record,
    updatedAt: new Date().toISOString(),
    managerNotification: {
      ...record.managerNotification,
      status: "delivery_failed",
      lastError: message,
      channels
    }
  };
}

function buildOrderRedirect(record: OrderRecord, deliveryStatus: OrderNotificationStatus) {
  const orderAccessConfig = getOrderAccessConfig();
  const accessToken = orderAccessConfig.enabled ? createOrderAccessToken(record) : undefined;

  return (
    `/thanks?source=${encodeURIComponent(record.source)}` +
    `&kind=order&orderNumber=${encodeURIComponent(record.orderNumber)}` +
    `&deliveryMethod=${encodeURIComponent(record.deliveryMethod)}` +
    `&deliveryStatus=${encodeURIComponent(deliveryStatus)}` +
    `&orderId=${encodeURIComponent(record.id)}` +
    (accessToken ? `&access=${encodeURIComponent(accessToken)}` : "")
  );
}

function createOrderSavedResponse(args: {
  record: OrderRecord;
  deliveryStatus: OrderNotificationStatus;
  message: string;
  wasDeduplicated?: boolean;
}): OrderSubmissionResponse {
  return {
    ok: true,
    message: args.message,
    orderId: args.record.id,
    orderNumber: args.record.orderNumber,
    deliveryStatus: args.deliveryStatus,
    wasDeduplicated: args.wasDeduplicated,
    redirectTo: buildOrderRedirect(args.record, args.deliveryStatus)
  };
}

export async function deliverSavedOrder(
  record: OrderRecord,
  deliveryTrigger: OrderNotificationDeliveryTrigger = "initial"
): Promise<{
  record: OrderRecord;
  response: OrderSubmissionResponse;
}> {
  const availability = getOperationsNotificationConfig();
  const attemptRecord = startOrderNotificationAttempt(record, deliveryTrigger);

  if (!availability.isConfigured) {
    const failedRecord = markOrderNotificationFailed(
      attemptRecord,
      `${orderValidationMessages.formUnavailable} Заказ сохранен локально и ждет повторной доставки менеджеру.`
    );

    return {
      record: failedRecord,
      response: createOrderSavedResponse({
        record: failedRecord,
        deliveryStatus: failedRecord.managerNotification.status,
        message: orderValidationMessages.savedForRetry
      })
    };
  }

  const event: OrderWebhookEvent = {
    event: "order.created",
    orderId: record.id,
    orderNumber: record.orderNumber,
    createdAt: record.createdAt,
    payload: attemptRecord,
    meta: {
      channel: "webhook",
      site: availability.siteName,
      deliveryTrigger,
      publicStatusHref: getOrderAccessConfig().enabled ? getPublicOrderStatusHref(record) : undefined
    }
  };

  const response = await deliverOperationsEvent(event);
  const channels = mapChannelResultsToState(response.channels);

  if (response.ok) {
    const deliveredRecord = markOrderNotificationDelivered(attemptRecord, channels);

    return {
      record: deliveredRecord,
      response: createOrderSavedResponse({
        record: deliveredRecord,
        deliveryStatus: deliveredRecord.managerNotification.status,
        message: orderValidationMessages.success
      })
    };
  }

  const errorMessage =
    response.status && response.status !== 502
      ? `${orderValidationMessages.deliveryFailed} Канал вернул статус ${response.status}.`
      : `${orderValidationMessages.deliveryFailed} Канал временно недоступен.`;
  const failedRecord = markOrderNotificationFailed(attemptRecord, errorMessage, channels);

  return {
    record: failedRecord,
    response: createOrderSavedResponse({
      record: failedRecord,
      deliveryStatus: failedRecord.managerNotification.status,
      message: orderValidationMessages.savedForRetry
    })
  };
}

export function createExistingOrderResponse(record: OrderRecord): OrderSubmissionResponse {
  if (record.managerNotification.status === "delivered") {
    return createOrderSavedResponse({
      record,
      deliveryStatus: record.managerNotification.status,
      message: orderValidationMessages.retryDelivered,
      wasDeduplicated: true
    });
  }

  return createOrderSavedResponse({
    record,
    deliveryStatus: record.managerNotification.status,
    message: orderValidationMessages.retryStillPending,
    wasDeduplicated: true
  });
}
