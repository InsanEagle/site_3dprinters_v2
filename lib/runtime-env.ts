function normalizeText(value: string | undefined) {
  return value?.trim() || "";
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

export function isDevelopmentEnvironment() {
  return !isProductionEnvironment();
}

export function readEnvText(name: string) {
  return normalizeText(process.env[name]);
}

function normalizeBaseUrl(value: string | undefined, options?: { allowLocalhost?: boolean }) {
  const normalized = normalizeText(value).replace(/\/+$/, "");

  if (!normalized) {
    return undefined;
  }

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.toLowerCase();
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    if (hostname === "0.0.0.0") {
      return undefined;
    }

    if (!options?.allowLocalhost && isLocalhost) {
      return undefined;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

export function getPublicBaseUrl(fallbackUrl?: string) {
  const allowLocalhost = isDevelopmentEnvironment();
  const configuredUrl =
    normalizeBaseUrl(readEnvText("APP_URL"), { allowLocalhost }) ??
    normalizeBaseUrl(readEnvText("NEXT_PUBLIC_SITE_URL"), { allowLocalhost });

  if (configuredUrl) {
    return configuredUrl;
  }

  if (fallbackUrl) {
    const fallbackOrigin = new URL(fallbackUrl).origin;
    return normalizeBaseUrl(fallbackOrigin, { allowLocalhost });
  }

  return undefined;
}
