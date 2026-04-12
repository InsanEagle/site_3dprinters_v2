import { DeliveryMethod } from "@/lib/delivery";

export const ORDER_FIELD_NAMES = ["name", "contact", "city", "address", "deliveryMethod", "comment", "items"] as const;

export type OrderFieldName = (typeof ORDER_FIELD_NAMES)[number];
export type OrderDeliveryMethod = DeliveryMethod;
export type OrderStatus = "new" | "processing";
export type OrderNotificationStatus = "pending" | "delivered" | "failed";

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
  managerNotification: {
    channel: "webhook";
    status: OrderNotificationStatus;
    deliveredAt?: string;
    lastError?: string;
  };
};

export type OrderSubmissionPayload = {
  source: string;
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
  deliveryFailed: "Заказ не был доставлен в канал приема. Попробуйте повторить отправку немного позже.",
  serverError: "Не удалось оформить заказ из-за технической ошибки. Попробуйте еще раз позже.",
  success: "Заказ отправлен. Мы зафиксировали состав корзины и передали его в обработку менеджеру."
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

export function validateOrderSubmission(payload: unknown): {
  data?: OrderSubmissionPayload;
  fieldErrors: OrderFieldErrors;
} {
  const candidate = payload as Partial<OrderSubmissionPayload> | undefined;
  const source = normalizeText(candidate?.source);
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

  const normalizedItems = items
    .map((item) => ({
      slug: item.slug,
      quantity: Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1
    }))
    .filter((item) => item.slug);

  if (!source || Object.keys(fieldErrors).length) {
    return { fieldErrors };
  }

  return {
    data: {
      source,
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
