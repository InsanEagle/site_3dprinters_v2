export const REQUEST_FIELD_NAMES = ["name", "contact", "details", "file"] as const;

export type RequestFieldName = (typeof REQUEST_FIELD_NAMES)[number];

export type RequestSubmissionPayload = {
  source: string;
  name: string;
  contact: string;
  brand?: string;
  model?: string;
  details: string;
  productName?: string;
};

export type RequestFieldErrors = Partial<Record<RequestFieldName, string>>;

export type RequestSubmissionResponse =
  | {
      ok: true;
      message: string;
      redirectTo?: string;
    }
  | {
      ok: false;
      code: "validation_error" | "submission_unavailable" | "delivery_failed" | "server_error";
      message: string;
      fieldErrors?: RequestFieldErrors;
    };

export type RequestWebhookEvent = {
  event: "request.created";
  requestId: string;
  createdAt: string;
  payload: RequestSubmissionPayload;
  meta: {
    channel: "webhook";
    site: string;
  };
};

export const requestValidationMessages = {
  nameRequired: "Укажите имя, чтобы мы понимали, как к вам обратиться.",
  nameTooShort: "Имя должно содержать не меньше 2 символов.",
  contactRequired: "Укажите телефон, email или удобный мессенджер для связи.",
  contactTooShort: "Контакт выглядит слишком коротким. Добавьте больше данных для связи.",
  detailsRequired: "Опишите задачу, чтобы можно было провести первичную оценку.",
  detailsTooShort: "Добавьте чуть больше деталей: что нужно изготовить, восстановить или доработать.",
  fileUnavailable:
    "Прикрепление файлов через сайт пока не настроено. Добавьте описание и передайте материалы отдельным каналом после ответа на заявку.",
  formUnavailable:
    "Отправка через сайт пока не подключена. Заявка не была отправлена. Добавьте webhook в env или используйте другой канал связи.",
  deliveryFailed:
    "Заявка не была доставлена в канал приема. Проверьте настройки webhook или попробуйте повторить отправку позже.",
  serverError: "Не удалось обработать заявку из-за технической ошибки. Попробуйте еще раз позже.",
  success: "Заявка отправлена. Мы получили запрос и вернемся с уточнениями, если они понадобятся."
} as const;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const CONTACT_MIN_LENGTH = 5;
const CONTACT_MAX_LENGTH = 120;
const DETAILS_MIN_LENGTH = 10;
const DETAILS_MAX_LENGTH = 2000;
function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

export function validateRequestSubmission(payload: unknown): {
  data?: RequestSubmissionPayload;
  fieldErrors: RequestFieldErrors;
} {
  const source = normalizeText((payload as RequestSubmissionPayload | undefined)?.source);
  const name = normalizeText((payload as RequestSubmissionPayload | undefined)?.name);
  const contact = normalizeText((payload as RequestSubmissionPayload | undefined)?.contact);
  const details = normalizeText((payload as RequestSubmissionPayload | undefined)?.details);
  const brand = normalizeOptionalText((payload as RequestSubmissionPayload | undefined)?.brand);
  const model = normalizeOptionalText((payload as RequestSubmissionPayload | undefined)?.model);
  const productName = normalizeOptionalText((payload as RequestSubmissionPayload | undefined)?.productName);

  const fieldErrors: RequestFieldErrors = {};

  if (!name) {
    fieldErrors.name = requestValidationMessages.nameRequired;
  } else if (name.length < NAME_MIN_LENGTH) {
    fieldErrors.name = requestValidationMessages.nameTooShort;
  } else if (name.length > NAME_MAX_LENGTH) {
    fieldErrors.name = `Имя должно быть короче ${NAME_MAX_LENGTH + 1} символа.`;
  }

  if (!contact) {
    fieldErrors.contact = requestValidationMessages.contactRequired;
  } else if (contact.length < CONTACT_MIN_LENGTH) {
    fieldErrors.contact = requestValidationMessages.contactTooShort;
  } else if (contact.length > CONTACT_MAX_LENGTH) {
    fieldErrors.contact = `Контакт должен быть короче ${CONTACT_MAX_LENGTH + 1} символа.`;
  }

  if (!details) {
    fieldErrors.details = requestValidationMessages.detailsRequired;
  } else if (details.length < DETAILS_MIN_LENGTH) {
    fieldErrors.details = requestValidationMessages.detailsTooShort;
  } else if (details.length > DETAILS_MAX_LENGTH) {
    fieldErrors.details = `Описание должно быть короче ${DETAILS_MAX_LENGTH + 1} символа.`;
  }

  if (!source || Object.keys(fieldErrors).length) {
    return { fieldErrors };
  }

  return {
    data: {
      source,
      name,
      contact,
      details,
      brand,
      model,
      productName
    },
    fieldErrors
  };
}

export function getRequestSubmissionAvailability() {
  const webhookUrl = normalizeText(process.env.REQUESTS_WEBHOOK_URL);
  const webhookToken = normalizeText(process.env.REQUESTS_WEBHOOK_TOKEN);
  const siteName = normalizeText(process.env.NEXT_PUBLIC_SITE_NAME) || "Изготовление деталей";

  return {
    isConfigured: Boolean(webhookUrl),
    webhookUrl: webhookUrl || undefined,
    webhookToken: webhookToken || undefined,
    siteName
  };
}

function buildWebhookEvent(payload: RequestSubmissionPayload, siteName: string): RequestWebhookEvent {
  return {
    event: "request.created",
    requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    payload,
    meta: {
      channel: "webhook",
      site: siteName
    }
  };
}

async function deliverRequestViaWebhook(
  event: RequestWebhookEvent,
  config: ReturnType<typeof getRequestSubmissionAvailability>
): Promise<RequestSubmissionResponse> {
  if (!config.webhookUrl) {
    return {
      ok: false,
      code: "submission_unavailable" as const,
      message: requestValidationMessages.formUnavailable
    };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Request-Event": event.event,
      "X-Request-Id": event.requestId
    };

    if (config.webhookToken) {
      headers.Authorization = `Bearer ${config.webhookToken}`;
    }

    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      return {
        ok: false,
        code: "delivery_failed" as const,
        message: `${requestValidationMessages.deliveryFailed} Канал вернул статус ${response.status}.`
      };
    }

    return {
      ok: true as const,
      message: requestValidationMessages.success,
      redirectTo: `/thanks?source=${encodeURIComponent(event.payload.source)}`
    };
  } catch {
    return {
      ok: false,
      code: "delivery_failed" as const,
      message: `${requestValidationMessages.deliveryFailed} Проверьте доступность URL и сетевое соединение.`
    };
  }
}

export async function submitRequestSubmission(
  payload: RequestSubmissionPayload
): Promise<RequestSubmissionResponse> {
  const availability = getRequestSubmissionAvailability();

  if (!availability.isConfigured) {
    return {
      ok: false,
      code: "submission_unavailable",
      message: requestValidationMessages.formUnavailable
    };
  }

  const event = buildWebhookEvent(payload, availability.siteName);
  return deliverRequestViaWebhook(event, availability);
}
