function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const DEFAULT_WEBHOOK_TIMEOUT_MS = 10_000;
const MIN_WEBHOOK_TIMEOUT_MS = 1_000;
const MAX_WEBHOOK_TIMEOUT_MS = 30_000;

function readWebhookTimeoutMs() {
  const rawValue = normalizeText(process.env.REQUESTS_WEBHOOK_TIMEOUT_MS);
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_WEBHOOK_TIMEOUT_MS;
  }

  return Math.min(MAX_WEBHOOK_TIMEOUT_MS, Math.max(MIN_WEBHOOK_TIMEOUT_MS, Math.floor(parsedValue)));
}

export function getWebhookDeliveryConfig() {
  const webhookUrl = normalizeText(process.env.REQUESTS_WEBHOOK_URL);
  const webhookToken = normalizeText(process.env.REQUESTS_WEBHOOK_TOKEN);
  const siteName = normalizeText(process.env.NEXT_PUBLIC_SITE_NAME) || "Изготовление деталей";

  return {
    isConfigured: Boolean(webhookUrl),
    webhookUrl: webhookUrl || undefined,
    webhookToken: webhookToken || undefined,
    timeoutMs: readWebhookTimeoutMs(),
    siteName
  };
}

export async function deliverJsonWebhook(args: {
  eventName: string;
  requestId: string;
  body: unknown;
  config?: ReturnType<typeof getWebhookDeliveryConfig>;
}) {
  const config = args.config ?? getWebhookDeliveryConfig();

  if (!config.webhookUrl) {
    return {
      ok: false as const,
      status: 503,
      siteName: config.siteName,
      error: "Webhook URL is not configured."
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Request-Event": args.eventName,
      "X-Request-Id": args.requestId
    };

    if (config.webhookToken) {
      headers.Authorization = `Bearer ${config.webhookToken}`;
    }

    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(args.body),
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        ok: false as const,
        status: response.status,
        siteName: config.siteName,
        error: `Webhook returned status ${response.status}.`
      };
    }

    return {
      ok: true as const,
      status: response.status,
      siteName: config.siteName
    };
  } catch {
    return {
      ok: false as const,
      status: 502,
      siteName: config.siteName,
      error: "Could not reach webhook endpoint."
    };
  } finally {
    clearTimeout(timeout);
  }
}
