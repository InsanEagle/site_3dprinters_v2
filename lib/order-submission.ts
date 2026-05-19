import { DeliveryMethod } from "@/lib/delivery";

export const ORDER_FIELD_NAMES = ["name", "contact", "city", "address", "deliveryMethod", "comment", "items", "idempotencyKey"] as const;
export const ORDER_STATUSES = ["new", "confirmed", "processing", "completed", "cancelled"] as const;
export const ORDER_NOTIFICATION_STATUSES = ["pending_delivery", "delivered", "delivery_failed"] as const;
export const ORDER_NOTIFICATION_DELIVERY_TRIGGERS = ["initial", "retry"] as const;

export type OrderFieldName = (typeof ORDER_FIELD_NAMES)[number];
export type OrderDeliveryMethod = DeliveryMethod;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderNotificationStatus = (typeof ORDER_NOTIFICATION_STATUSES)[number];
export type OrderNotificationDeliveryTrigger = (typeof ORDER_NOTIFICATION_DELIVERY_TRIGGERS)[number];

export type OrderCustomerDetails = {
  name: string;
  contact: string;
  city: string;
  address?: string;
  deliveryMethod: OrderDeliveryMethod;
  comment?: string;
};

export type OrderLineItemInput = {
  productSlug: string;
  sku?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderLineItem = OrderLineItemInput & {
  orderId: string;
};

export type OrderNotificationChannelState = {
  name: "primary" | "messenger" | "email" | "sheets";
  label: string;
  required: boolean;
  configured: boolean;
  ok: boolean;
  status: number;
  deliveredAt?: string;
  lastError?: string;
};

export type OrderManagerNotification = {
  channel: "webhook";
  status: OrderNotificationStatus;
  deliveryTrigger?: OrderNotificationDeliveryTrigger;
  attemptCount: number;
  lastAttemptAt?: string;
  deliveredAt?: string;
  lastError?: string;
  channels?: OrderNotificationChannelState[];
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  source: string;
  customerName: string;
  customerContact: string;
  city: string;
  address?: string;
  deliveryMethod: OrderDeliveryMethod;
  deliveryLabel: string;
  deliveryNote: string;
  deliveryFee?: number;
  comment?: string;
  subtotal: number;
  currency: "RUB";
  commercialNote: string;
  fulfillmentNote: string;
  items: OrderLineItem[];
  idempotencyKey?: string;
  submissionFingerprint?: string;
  managerNotification: OrderManagerNotification;
};

export type OrderSubmissionPayload = {
  source: string;
  idempotencyKey?: string;
  items: Array<{
    slug: string;
    quantity: number;
  }>;
  customer: OrderCustomerDetails;
};

export type OrderFieldErrors = Partial<Record<OrderFieldName, string>>;

export type OrderSubmissionResponse =
  | {
      ok: true;
      message: string;
      redirectTo?: string;
      orderId: string;
      orderNumber: string;
      deliveryStatus: OrderNotificationStatus;
      wasDeduplicated?: boolean;
    }
  | {
      ok: false;
      code: "validation_error" | "checkout_unavailable" | "submission_unavailable" | "delivery_failed" | "server_error";
      message: string;
      fieldErrors?: OrderFieldErrors;
      orderId?: string;
      orderNumber?: string;
    };

export type OrderWebhookEvent = {
  event: "order.created";
  orderId: string;
  orderNumber: string;
  createdAt: string;
  payload: OrderRecord;
  meta: {
    channel: "webhook";
    site: string;
    deliveryTrigger: OrderNotificationDeliveryTrigger;
    publicStatusHref?: string;
  };
};

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const CONTACT_MIN_LENGTH = 5;
const CONTACT_MAX_LENGTH = 120;
const CITY_MIN_LENGTH = 2;
const CITY_MAX_LENGTH = 120;
const ADDRESS_MAX_LENGTH = 240;
const COMMENT_MAX_LENGTH = 1000;
const IDEMPOTENCY_KEY_MIN_LENGTH = 12;
const IDEMPOTENCY_KEY_MAX_LENGTH = 160;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9:_-]+$/;

export const orderValidationMessages = {
  nameRequired: "Укажите имя получателя или контактного лица.",
  nameTooShort: "Имя должно содержать не меньше 2 символов.",
  contactRequired: "Укажите телефон, email или мессенджер для связи по заказу.",
  contactTooShort: "Контакт выглядит слишком коротким. Добавьте больше данных для связи.",
  cityRequired: "Укажите город, чтобы мы понимали базовый сценарий получения заказа.",
  cityTooShort: "Название города выглядит слишком коротким.",
  deliveryMethodRequired: "Выберите способ получения заказа.",
  deliveryMethodUnavailable: "Этот способ получения сейчас нельзя честно оформить для текущей корзины.",
  addressRequired: "Для доставки нужен адрес или понятный ориентир.",
  itemsRequired: "Корзина пуста. Добавьте товары перед оформлением заказа.",
  checkoutUnavailable:
    "Часть корзины больше не подходит для прямого оформления. Проверьте позиции и вернитесь в checkout еще раз.",
  formUnavailable:
    "Оформление заказа через сайт пока недоступно. Проверьте настройки приема заказов или используйте другой канал связи.",
  deliveryFailed: "Заказ сохранен, но автоматическая передача менеджеру пока не подтвердилась. Повторную доставку можно выполнить без потери заказа.",
  serverError: "Не удалось оформить заказ из-за технической ошибки. Попробуйте еще раз позже.",
  success: "Заказ сохранен и передан в обработку менеджеру.",
  savedForRetry:
    "Заказ сохранен. Автоматическая передача менеджеру пока не подтвердилась, но заказ не потерян и останется в системе до повторной доставки.",
  retryDelivered: "Заказ уже был сохранен ранее и теперь успешно передан менеджеру.",
  retryStillPending:
    "Заказ уже был сохранен ранее. Повторная попытка передачи менеджеру пока не подтвердилась, но дубликат не создан.",
  duplicateConflict:
    "Эта попытка оформления уже использовалась для другого заказа. Обновите checkout и попробуйте отправить заказ заново.",
  idempotencyKeyInvalid: "Служебный ключ оформления заказа поврежден. Обновите страницу checkout и попробуйте снова."
} as const;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

function normalizeDeliveryMethod(value: unknown) {
  return value === "delivery" || value === "pickup" ? value : undefined;
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && ORDER_STATUSES.includes(value as OrderStatus);
}

export function isOrderNotificationStatus(value: unknown): value is OrderNotificationStatus {
  return typeof value === "string" && ORDER_NOTIFICATION_STATUSES.includes(value as OrderNotificationStatus);
}

export function normalizeOrderNotificationStatus(value: unknown): OrderNotificationStatus {
  if (value === "pending") {
    return "pending_delivery";
  }

  if (value === "failed") {
    return "delivery_failed";
  }

  return isOrderNotificationStatus(value) ? value : "pending_delivery";
}

function normalizeIdempotencyKey(value: unknown) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return undefined;
  }

  return normalized;
}

export function validateOrderSubmission(payload: unknown): {
  data?: OrderSubmissionPayload;
  fieldErrors: OrderFieldErrors;
  message?: string;
} {
  const candidate = payload as Partial<OrderSubmissionPayload> | undefined;
  const source = normalizeText(candidate?.source);
  const idempotencyKey = normalizeIdempotencyKey(candidate?.idempotencyKey);
  const items = Array.isArray(candidate?.items)
    ? candidate?.items
        .map((item) => ({
          slug: normalizeText(item?.slug),
          quantity: Number(item?.quantity)
        }))
        .filter((item) => item.slug)
    : [];
  const customer = candidate?.customer;
  const name = normalizeText(customer?.name);
  const contact = normalizeText(customer?.contact);
  const city = normalizeText(customer?.city);
  const address = normalizeOptionalText(customer?.address);
  const deliveryMethod = normalizeDeliveryMethod(customer?.deliveryMethod);
  const comment = normalizeOptionalText(customer?.comment);

  const fieldErrors: OrderFieldErrors = {};
  let message: string | undefined;

  if (!items.length) {
    fieldErrors.items = orderValidationMessages.itemsRequired;
  }

  if (!name) {
    fieldErrors.name = orderValidationMessages.nameRequired;
  } else if (name.length < NAME_MIN_LENGTH) {
    fieldErrors.name = orderValidationMessages.nameTooShort;
  } else if (name.length > NAME_MAX_LENGTH) {
    fieldErrors.name = `Имя должно быть короче ${NAME_MAX_LENGTH + 1} символа.`;
  }

  if (!contact) {
    fieldErrors.contact = orderValidationMessages.contactRequired;
  } else if (contact.length < CONTACT_MIN_LENGTH) {
    fieldErrors.contact = orderValidationMessages.contactTooShort;
  } else if (contact.length > CONTACT_MAX_LENGTH) {
    fieldErrors.contact = `Контакт должен быть короче ${CONTACT_MAX_LENGTH + 1} символа.`;
  }

  if (!city) {
    fieldErrors.city = orderValidationMessages.cityRequired;
  } else if (city.length < CITY_MIN_LENGTH) {
    fieldErrors.city = orderValidationMessages.cityTooShort;
  } else if (city.length > CITY_MAX_LENGTH) {
    fieldErrors.city = `Город должен быть короче ${CITY_MAX_LENGTH + 1} символа.`;
  }

  if (!deliveryMethod) {
    fieldErrors.deliveryMethod = orderValidationMessages.deliveryMethodRequired;
  }

  if (deliveryMethod === "delivery") {
    if (!address) {
      fieldErrors.address = orderValidationMessages.addressRequired;
    } else if (address.length > ADDRESS_MAX_LENGTH) {
      fieldErrors.address = `Адрес должен быть короче ${ADDRESS_MAX_LENGTH + 1} символа.`;
    }
  } else if (address && address.length > ADDRESS_MAX_LENGTH) {
    fieldErrors.address = `Адрес должен быть короче ${ADDRESS_MAX_LENGTH + 1} символа.`;
  }

  if (comment && comment.length > COMMENT_MAX_LENGTH) {
    fieldErrors.comment = `Комментарий должен быть короче ${COMMENT_MAX_LENGTH + 1} символа.`;
  }

  if (idempotencyKey) {
    if (idempotencyKey.length < IDEMPOTENCY_KEY_MIN_LENGTH || idempotencyKey.length > IDEMPOTENCY_KEY_MAX_LENGTH || !IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
      fieldErrors.idempotencyKey = orderValidationMessages.idempotencyKeyInvalid;
      message = orderValidationMessages.idempotencyKeyInvalid;
    }
  }

  const normalizedItems = items
    .map((item) => ({
      slug: item.slug,
      quantity: Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1
    }))
    .filter((item) => item.slug);

  if (!source || Object.keys(fieldErrors).length || message) {
    return { fieldErrors, message };
  }

  return {
    data: {
      source,
      idempotencyKey,
      items: normalizedItems,
      customer: {
        name,
        contact,
        city,
        address,
        deliveryMethod: deliveryMethod as OrderDeliveryMethod,
        comment
      }
    },
    fieldErrors
  };
}
