import type { OrderWebhookEvent } from "@/lib/order-submission";
import type { RequestWebhookEvent } from "@/lib/request-submission";
import { deliverJsonWebhook, getWebhookDeliveryConfig } from "@/lib/webhook-delivery";

type OperationsEvent = RequestWebhookEvent | OrderWebhookEvent;
export type OperationsChannelName = "primary" | "messenger" | "email" | "sheets";

type OperationsDestination = {
  name: OperationsChannelName;
  label: string;
  required: boolean;
  config: ReturnType<typeof getWebhookDeliveryConfig>;
};

export type OperationsChannelResult = {
  name: OperationsChannelName;
  label: string;
  ok: boolean;
  status: number;
  required: boolean;
  configured: boolean;
  error?: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createWebhookConfigFromEnv(urlEnvName: string, tokenEnvName: string, fallbackSiteName: string, timeoutMs: number) {
  const webhookUrl = normalizeText(process.env[urlEnvName]);
  const webhookToken = normalizeText(process.env[tokenEnvName]);

  return {
    isConfigured: Boolean(webhookUrl),
    webhookUrl: webhookUrl || undefined,
    webhookToken: webhookToken || undefined,
    timeoutMs,
    siteName: fallbackSiteName
  };
}

function getDestinationLabel(name: Exclude<OperationsChannelName, "primary">) {
  const envName =
    name === "messenger"
      ? "OPERATIONS_MESSENGER_LABEL"
      : name === "email"
        ? "OPERATIONS_EMAIL_LABEL"
        : "OPERATIONS_SHEETS_LABEL";

  const configuredLabel = normalizeText(process.env[envName]);

  if (configuredLabel) {
    return configuredLabel;
  }

  if (name === "messenger") {
    return "Уведомление в мессенджер";
  }

  if (name === "email") {
    return "Email-уведомление";
  }

  return "Запись в таблицу";
}

function formatRequestText(event: RequestWebhookEvent) {
  const lines = [
    `Новая заявка: ${event.payload.name}`,
    `Контакт: ${event.payload.contact}`,
    `Источник: ${event.payload.source}`,
    event.payload.productName ? `Позиция: ${event.payload.productName}` : undefined,
    event.payload.brand ? `Марка: ${event.payload.brand}` : undefined,
    event.payload.model ? `Модель: ${event.payload.model}` : undefined,
    `Описание: ${event.payload.details}`,
    event.payload.attachments?.length
      ? `Вложения: ${event.payload.attachments.length} шт. ${event.payload.attachments.map((attachment) => attachment.url).join(", ")}`
      : "Вложения: нет"
  ].filter(Boolean) as string[];

  return {
    title: "Новая заявка с сайта",
    subject: `Новая заявка: ${event.payload.name}`,
    lines,
    text: lines.join("\n")
  };
}

function formatOrderText(event: OrderWebhookEvent) {
  const lines = [
    `Новый заказ: ${event.orderNumber}`,
    `Клиент: ${event.payload.customerName}`,
    `Контакт: ${event.payload.customerContact}`,
    `Город: ${event.payload.city}`,
    `Источник: ${event.payload.source}`,
    `Тип доставки уведомления: ${event.meta.deliveryTrigger === "retry" ? "retry" : "initial"}`,
    `Способ получения: ${event.payload.deliveryLabel}`,
    `Subtotal: ${event.payload.subtotal} ${event.payload.currency}`,
    `Позиции: ${event.payload.items.map((item) => `${item.name} x${item.quantity}`).join("; ")}`,
    event.meta.publicStatusHref ? `Public status: ${event.meta.publicStatusHref}` : undefined
  ].filter(Boolean) as string[];

  return {
    title: "Новый заказ с сайта",
    subject: `Новый заказ: ${event.orderNumber}`,
    lines,
    text: lines.join("\n")
  };
}

function formatOperationsEventForChannel(channelName: Exclude<OperationsChannelName, "primary">, event: OperationsEvent) {
  const base = event.event === "request.created" ? formatRequestText(event) : formatOrderText(event as OrderWebhookEvent);

  if (channelName === "messenger") {
    return {
      channel: "messenger",
      event: event.event,
      requestId: event.event === "request.created" ? event.requestId : event.orderId,
      summary: base.lines[0],
      title: base.title,
      text: base.text,
      lines: base.lines,
      rawEvent: event
    };
  }

  if (channelName === "email") {
    return {
      channel: "email",
      event: event.event,
      requestId: event.event === "request.created" ? event.requestId : event.orderId,
      summary: base.lines[0],
      subject: base.subject,
      text: base.text,
      html: `<pre>${base.text.replace(/[<>&]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[character] ?? character))}</pre>`,
      rawEvent: event
    };
  }

  const row =
    event.event === "request.created"
      ? {
          createdAt: event.createdAt,
          event: event.event,
          summary: base.lines[0],
          source: event.payload.source,
          name: event.payload.name,
          contact: event.payload.contact,
          productName: event.payload.productName ?? "",
          brand: event.payload.brand ?? "",
          model: event.payload.model ?? "",
          details: event.payload.details,
          attachments: event.payload.attachments?.map((attachment) => attachment.url).join("\n") ?? ""
        }
      : {
          createdAt: event.createdAt,
          event: event.event,
          summary: base.lines[0],
          orderNumber: event.orderNumber,
          source: event.payload.source,
          customerName: event.payload.customerName,
          customerContact: event.payload.customerContact,
          city: event.payload.city,
          deliveryLabel: event.payload.deliveryLabel,
          subtotal: event.payload.subtotal,
          currency: event.payload.currency,
          deliveryTrigger: event.meta.deliveryTrigger,
          items: event.payload.items.map((item) => `${item.name} x${item.quantity}`).join("; ")
        };

  return {
    channel: "sheets",
    event: event.event,
    requestId: event.event === "request.created" ? event.requestId : event.orderId,
    row,
    rawEvent: event
  };
}

async function deliverToDestination(destination: OperationsDestination, event: OperationsEvent): Promise<OperationsChannelResult> {
  const body = destination.name === "primary" ? event : formatOperationsEventForChannel(destination.name, event);
  const response = await deliverJsonWebhook({
    eventName: destination.name === "primary" ? event.event : `${event.event}.${destination.name}`,
    requestId: event.event === "request.created" ? event.requestId : event.orderId,
    body,
    config: destination.config
  });

  return {
    name: destination.name,
    label: destination.label,
    required: destination.required,
    configured: destination.config.isConfigured,
    ok: response.ok,
    status: response.status,
    error: response.ok ? undefined : response.error
  };
}

export function getOperationsNotificationConfig() {
  const primary = getWebhookDeliveryConfig();
  const siteName = primary.siteName;
  const destinations: OperationsDestination[] = [
    {
      name: "primary",
      label: "Primary webhook",
      required: true,
      config: primary
    },
    {
      name: "messenger",
      label: getDestinationLabel("messenger"),
      required: false,
      config: createWebhookConfigFromEnv("OPERATIONS_MESSENGER_WEBHOOK_URL", "OPERATIONS_MESSENGER_WEBHOOK_TOKEN", siteName, primary.timeoutMs)
    },
    {
      name: "email",
      label: getDestinationLabel("email"),
      required: false,
      config: createWebhookConfigFromEnv("OPERATIONS_EMAIL_WEBHOOK_URL", "OPERATIONS_EMAIL_WEBHOOK_TOKEN", siteName, primary.timeoutMs)
    },
    {
      name: "sheets",
      label: getDestinationLabel("sheets"),
      required: false,
      config: createWebhookConfigFromEnv("OPERATIONS_SHEETS_WEBHOOK_URL", "OPERATIONS_SHEETS_WEBHOOK_TOKEN", siteName, primary.timeoutMs)
    }
  ];

  return {
    isConfigured: primary.isConfigured,
    siteName,
    destinations,
    optionalDestinations: destinations.filter((destination) => !destination.required && destination.config.isConfigured)
  };
}

export function formatOperationsFailureSummary(results: OperationsChannelResult[]) {
  const failedResults = results.filter((result) => !result.ok);

  if (!failedResults.length) {
    return undefined;
  }

  return failedResults.map((result) => `${result.label}: ${result.error ?? `status ${result.status}`}`).join("; ");
}

export async function deliverOperationsEvent(event: OperationsEvent) {
  const config = getOperationsNotificationConfig();
  const primaryDestination = config.destinations[0];

  if (!primaryDestination.config.isConfigured) {
    return {
      ok: false as const,
      status: 503,
      siteName: config.siteName,
      error: "Primary webhook URL is not configured.",
      channels: [] as OperationsChannelResult[]
    };
  }

  const primaryResult = await deliverToDestination(primaryDestination, event);

  if (!primaryResult.ok) {
    return {
      ok: false as const,
      status: primaryResult.status,
      siteName: config.siteName,
      error: primaryResult.error ?? "Primary webhook delivery failed.",
      channels: [primaryResult]
    };
  }

  const optionalResults = await Promise.all(config.optionalDestinations.map((destination) => deliverToDestination(destination, event)));
  const channels = [primaryResult, ...optionalResults];

  optionalResults
    .filter((result) => !result.ok)
    .forEach((result) => {
      console.warn(`[operations-notifications] Optional channel failed: ${result.label}. ${result.error ?? `status ${result.status}`}`);
    });

  return {
    ok: true as const,
    status: primaryResult.status,
    siteName: config.siteName,
    channels
  };
}
