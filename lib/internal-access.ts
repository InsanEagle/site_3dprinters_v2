import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { isProductionEnvironment, readEnvText } from "@/lib/runtime-env";

const INTERNAL_SESSION_COOKIE_BASENAME = "internal_backoffice_session";
const INTERNAL_GUARD_COOKIE_BASENAME = "internal_backoffice_guard";
const DEV_INTERNAL_SESSION_SECRET = "internal-backoffice-dev-only";
const SESSION_VERSION = 1;

type InternalSessionPayload = {
  v: number;
  iat: number;
  exp: number;
};

type InternalLoginGuardPayload = {
  v: number;
  attempts: number;
  firstFailedAt: number;
  lastFailedAt: number;
  cooldownUntil?: number;
};

function getCookieName(baseName: string, isProduction: boolean) {
  return isProduction ? `__Secure-${baseName}` : baseName;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSecretMaterial(password: string, sessionSalt: string) {
  return createHash("sha256").update(`${password}:${sessionSalt}`).digest("hex");
}

function createSignature(value: string, password: string, sessionSalt: string) {
  return createHmac("sha256", getSecretMaterial(password, sessionSalt)).update(value).digest("base64url");
}

function createSignedPayload<T>(payload: T, password: string, sessionSalt: string) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = createSignature(encodedPayload, password, sessionSalt);

  return `${encodedPayload}.${signature}`;
}

function parseSignedPayload<T>(value: string | undefined, password: string, sessionSalt: string): T | undefined {
  if (!value) {
    return undefined;
  }

  const [encodedPayload, providedSignature] = value.split(".");

  if (!encodedPayload || !providedSignature) {
    return undefined;
  }

  const expectedSignature = createSignature(encodedPayload, password, sessionSalt);

  if (providedSignature.length !== expectedSignature.length) {
    return undefined;
  }

  if (!timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))) {
    return undefined;
  }

  try {
    return JSON.parse(fromBase64Url(encodedPayload)) as T;
  } catch {
    return undefined;
  }
}

function getNow() {
  return Date.now();
}

export function getInternalAccessConfig() {
  const password = readEnvText("INTERNAL_BACKOFFICE_PASSWORD");
  const sessionSecret = readEnvText("INTERNAL_BACKOFFICE_SESSION_SECRET");
  const isProduction = isProductionEnvironment();
  const missing: string[] = [];

  if (!password) {
    missing.push("INTERNAL_BACKOFFICE_PASSWORD");
  }

  if (isProduction && !sessionSecret) {
    missing.push("INTERNAL_BACKOFFICE_SESSION_SECRET");
  }

  return {
    enabled: missing.length === 0,
    password: password || undefined,
    sessionSalt: sessionSecret || DEV_INTERNAL_SESSION_SECRET,
    isProduction,
    isMisconfigured: isProduction && missing.length > 0,
    missing,
    sessionMaxAgeSeconds: 60 * 60 * 12,
    loginAttemptWindowSeconds: 60 * 15,
    maxFailedLoginAttempts: 5,
    loginCooldownSeconds: 60 * 15,
    sessionCookieName: getCookieName(INTERNAL_SESSION_COOKIE_BASENAME, isProduction),
    guardCookieName: getCookieName(INTERNAL_GUARD_COOKIE_BASENAME, isProduction)
  };
}

function createSessionCookieValue(password: string, sessionSalt: string, sessionMaxAgeSeconds: number) {
  const now = getNow();

  return createSignedPayload<InternalSessionPayload>(
    {
      v: SESSION_VERSION,
      iat: now,
      exp: now + sessionMaxAgeSeconds * 1000
    },
    password,
    sessionSalt
  );
}

function parseSessionCookieValue(value: string | undefined, password: string, sessionSalt: string) {
  return parseSignedPayload<InternalSessionPayload>(value, password, sessionSalt);
}

function parseGuardCookieValue(value: string | undefined, password: string, sessionSalt: string) {
  return parseSignedPayload<InternalLoginGuardPayload>(value, password, sessionSalt);
}

function getCookieOptions(path: string, maxAge: number, isProduction: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "strict" as const,
    secure: isProduction,
    path,
    maxAge,
    priority: "high" as const
  };
}

function sanitizeGuardState(
  payload: InternalLoginGuardPayload | undefined,
  now: number,
  attemptWindowSeconds: number
): InternalLoginGuardPayload | undefined {
  if (!payload || payload.v !== SESSION_VERSION) {
    return undefined;
  }

  if (payload.cooldownUntil && payload.cooldownUntil > now) {
    return payload;
  }

  if (now - payload.lastFailedAt > attemptWindowSeconds * 1000) {
    return undefined;
  }

  return {
    ...payload,
    cooldownUntil: undefined
  };
}

export async function hasInternalAccess() {
  const config = getInternalAccessConfig();

  if (!config.enabled || !config.password) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(config.sessionCookieName)?.value;
  const payload = parseSessionCookieValue(sessionValue, config.password, config.sessionSalt);

  if (!payload || payload.v !== SESSION_VERSION) {
    return false;
  }

  return payload.exp > getNow();
}

export async function openInternalSession() {
  const config = getInternalAccessConfig();

  if (!config.enabled || !config.password) {
    const details = config.missing.length ? ` Missing env: ${config.missing.join(", ")}.` : "";
    throw new Error(`Internal backoffice access is not configured.${details}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    config.sessionCookieName,
    createSessionCookieValue(config.password, config.sessionSalt, config.sessionMaxAgeSeconds),
    getCookieOptions("/internal", config.sessionMaxAgeSeconds, config.isProduction)
  );
}

export async function closeInternalSession() {
  const config = getInternalAccessConfig();
  const cookieStore = await cookies();

  cookieStore.set(config.sessionCookieName, "", getCookieOptions("/internal", 0, config.isProduction));
}

export function verifyInternalPassword(candidate: string) {
  const config = getInternalAccessConfig();

  if (!config.enabled || !config.password) {
    return false;
  }

  const normalizedCandidate = candidate.trim();
  const normalizedPassword = config.password;
  const candidateDigest = createHash("sha256").update(normalizedCandidate).digest();
  const passwordDigest = createHash("sha256").update(normalizedPassword).digest();

  return timingSafeEqual(candidateDigest, passwordDigest) && normalizedCandidate === normalizedPassword;
}

export async function getInternalLoginGuardState() {
  const config = getInternalAccessConfig();

  if (!config.enabled || !config.password) {
    return {
      blocked: false,
      remainingCooldownSeconds: 0,
      attempts: 0
    };
  }

  const cookieStore = await cookies();
  const now = getNow();
  const guardValue = cookieStore.get(config.guardCookieName)?.value;
  const rawState = parseGuardCookieValue(guardValue, config.password, config.sessionSalt);
  const state = sanitizeGuardState(rawState, now, config.loginAttemptWindowSeconds);

  if (!state) {
    return {
      blocked: false,
      remainingCooldownSeconds: 0,
      attempts: 0
    };
  }

  return {
    blocked: Boolean(state.cooldownUntil && state.cooldownUntil > now),
    remainingCooldownSeconds: state.cooldownUntil ? Math.max(1, Math.ceil((state.cooldownUntil - now) / 1000)) : 0,
    attempts: state.attempts
  };
}

export async function registerFailedInternalLogin() {
  const config = getInternalAccessConfig();

  if (!config.enabled || !config.password) {
    return {
      blocked: false,
      remainingCooldownSeconds: 0,
      attempts: 0
    };
  }

  const cookieStore = await cookies();
  const now = getNow();
  const guardValue = cookieStore.get(config.guardCookieName)?.value;
  const rawState = parseGuardCookieValue(guardValue, config.password, config.sessionSalt);
  const state = sanitizeGuardState(rawState, now, config.loginAttemptWindowSeconds);
  const nextAttempts = state ? state.attempts + 1 : 1;
  const firstFailedAt = state?.firstFailedAt ?? now;
  const cooldownUntil =
    nextAttempts >= config.maxFailedLoginAttempts ? now + config.loginCooldownSeconds * 1000 : undefined;
  const nextState: InternalLoginGuardPayload = {
    v: SESSION_VERSION,
    attempts: nextAttempts,
    firstFailedAt,
    lastFailedAt: now,
    cooldownUntil
  };
  const maxAge = cooldownUntil
    ? Math.max(config.loginCooldownSeconds, Math.ceil((cooldownUntil - now) / 1000))
    : config.loginAttemptWindowSeconds;

  cookieStore.set(
    config.guardCookieName,
    createSignedPayload(nextState, config.password, config.sessionSalt),
    getCookieOptions("/internal", maxAge, config.isProduction)
  );

  return {
    blocked: Boolean(cooldownUntil),
    remainingCooldownSeconds: cooldownUntil ? Math.max(1, Math.ceil((cooldownUntil - now) / 1000)) : 0,
    attempts: nextAttempts
  };
}

export async function clearInternalLoginGuard() {
  const config = getInternalAccessConfig();
  const cookieStore = await cookies();

  cookieStore.set(config.guardCookieName, "", getCookieOptions("/internal", 0, config.isProduction));
}
