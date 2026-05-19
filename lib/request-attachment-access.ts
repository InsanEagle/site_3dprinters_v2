import { createHash, timingSafeEqual } from "node:crypto";
import { isProductionEnvironment, readEnvText } from "@/lib/runtime-env";

const DEV_REQUEST_ATTACHMENTS_ACCESS_SECRET = "request-attachments-dev-only";

function normalizeText(value: string | undefined) {
  return value?.trim() || "";
}

export function getRequestAttachmentAccessConfig() {
  const secret = readEnvText("REQUEST_ATTACHMENTS_ACCESS_SECRET");
  const isProduction = isProductionEnvironment();
  const enabled = Boolean(secret) || !isProduction;

  return {
    enabled,
    isProduction,
    isMisconfigured: isProduction && !secret,
    secret: secret || DEV_REQUEST_ATTACHMENTS_ACCESS_SECRET,
    missing: isProduction && !secret ? ["REQUEST_ATTACHMENTS_ACCESS_SECRET"] : []
  };
}

function createRequestAttachmentDigest(storageKey: string) {
  const config = getRequestAttachmentAccessConfig();
  return createHash("sha256").update(`${storageKey}:${config.secret}`).digest("hex").slice(0, 24);
}

export function createRequestAttachmentAccessToken(storageKey: string) {
  return createRequestAttachmentDigest(storageKey);
}

export function hasRequestAttachmentAccess(storageKey: string, candidate: string | undefined) {
  const config = getRequestAttachmentAccessConfig();

  if (!config.enabled) {
    return false;
  }

  const actual = normalizeText(candidate);
  const expected = createRequestAttachmentAccessToken(storageKey);

  if (!actual || actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
