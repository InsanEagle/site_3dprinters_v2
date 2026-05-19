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
