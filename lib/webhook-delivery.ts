function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getWebhookDeliveryConfig() {
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
      body: JSON.stringify(args.body)
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
  }
}
