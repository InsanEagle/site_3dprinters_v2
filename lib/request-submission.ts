import path from "path";

export const REQUEST_FIELD_NAMES = ["name", "contact", "details", "file"] as const;
export const REQUEST_UPLOAD_MAX_FILES = 5;
export const REQUEST_UPLOAD_MAX_FILE_SIZE = 8 * 1024 * 1024;
export const REQUEST_UPLOAD_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const REQUEST_UPLOAD_ACCEPT = REQUEST_UPLOAD_ALLOWED_TYPES.join(",");

export type RequestFieldName = (typeof REQUEST_FIELD_NAMES)[number];
export type RequestUploadMimeType = (typeof REQUEST_UPLOAD_ALLOWED_TYPES)[number];
export type RequestLikeFile = {
  name: string;
  type: string;
  size: number;
};

export type RequestAttachment = {
  fileName: string;
  contentType: string;
  size: number;
  relativeUrl: string;
  url: string;
};

export type RequestSubmissionPayload = {
  source: string;
  name: string;
  contact: string;
  brand?: string;
  model?: string;
  details: string;
  productName?: string;
  attachments?: RequestAttachment[];
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

const allowedExtensionsLabel = "JPG, PNG или WEBP";
const maxFileSizeLabel = `${Math.round(REQUEST_UPLOAD_MAX_FILE_SIZE / (1024 * 1024))} МБ`;
const maxFilesLabel = String(REQUEST_UPLOAD_MAX_FILES);
const uploadDirLabel = path.posix.join("public", "uploads", "requests");

export const requestValidationMessages = {
  nameRequired: "Укажите имя, чтобы мы понимали, как к вам обратиться.",
  nameTooShort: "Имя должно содержать не меньше 2 символов.",
  contactRequired: "Укажите телефон, email или удобный мессенджер для связи.",
  contactTooShort: "Контакт выглядит слишком коротким. Добавьте больше данных для связи.",
  detailsRequired: "Опишите задачу, чтобы можно было провести первичную оценку.",
  detailsTooShort: "Добавьте чуть больше деталей: что нужно изготовить, восстановить или доработать.",
  fileHint: `Можно прикрепить до ${maxFilesLabel} фото формата ${allowedExtensionsLabel}, до ${maxFileSizeLabel} на файл.`,
  fileTooMany: `Можно прикрепить не больше ${maxFilesLabel} файлов за одну заявку.`,
  fileUnsupportedType: `Поддерживаются только изображения формата ${allowedExtensionsLabel}.`,
  fileTooLarge: `Размер одного файла не должен превышать ${maxFileSizeLabel}.`,
  fileSaveError: `Не удалось подготовить фото к отправке. Попробуйте выбрать файлы заново или отправить заявку без них.`,
  formUnavailable:
    "Отправка через сайт пока не подключена. Заявка не была отправлена. Добавьте webhook в env или используйте другой канал связи.",
  deliveryFailed:
    "Заявка не была доставлена в канал приема. Проверьте настройки webhook или попробуйте повторить отправку позже.",
  serverError: "Не удалось обработать заявку из-за технической ошибки. Попробуйте еще раз позже.",
  success: `Заявка отправлена. Мы получили запрос${uploadDirLabel ? " и прикрепленные фото, если они были добавлены" : ""}.`
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

function normalizeAttachments(value: unknown): RequestAttachment[] | undefined {
  if (!Array.isArray(value) || !value.length) {
    return undefined;
  }

  const attachments = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<RequestAttachment>;
      const fileName = normalizeText(candidate.fileName);
      const contentType = normalizeText(candidate.contentType);
      const relativeUrl = normalizeText(candidate.relativeUrl);
      const url = normalizeText(candidate.url);
      const size = typeof candidate.size === "number" && Number.isFinite(candidate.size) ? candidate.size : 0;

      if (!fileName || !contentType || !relativeUrl || !url || size <= 0) {
        return null;
      }

      return {
        fileName,
        contentType,
        size,
        relativeUrl,
        url
      } satisfies RequestAttachment;
    })
    .filter(Boolean) as RequestAttachment[];

  return attachments.length ? attachments : undefined;
}

export function formatRequestFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} МБ`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

export function validateRequestFiles(files: RequestLikeFile[]) {
  if (!files.length) {
    return;
  }

  if (files.length > REQUEST_UPLOAD_MAX_FILES) {
    return requestValidationMessages.fileTooMany;
  }

  for (const file of files) {
    if (!REQUEST_UPLOAD_ALLOWED_TYPES.includes(file.type as RequestUploadMimeType)) {
      return `${requestValidationMessages.fileUnsupportedType} Файл: ${file.name}.`;
    }

    if (file.size > REQUEST_UPLOAD_MAX_FILE_SIZE) {
      return `${requestValidationMessages.fileTooLarge} Файл: ${file.name}.`;
    }
  }
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
  const attachments = normalizeAttachments((payload as RequestSubmissionPayload | undefined)?.attachments);

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

  if (attachments?.length) {
    const fileValidationMessage = validateRequestFiles(
      attachments.map((attachment) => ({
        name: attachment.fileName,
        type: attachment.contentType,
        size: attachment.size
      }))
    );

    if (fileValidationMessage) {
      fieldErrors.file = fileValidationMessage;
    }
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
      productName,
      attachments
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

export async function submitRequestSubmission(payload: RequestSubmissionPayload): Promise<RequestSubmissionResponse> {
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
