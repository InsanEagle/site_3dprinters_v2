const PLACEHOLDER_PATTERN = /todo|placeholder|mock/i;

export function hasMeaningfulText(value?: string | null) {
  if (!value) {
    return false;
  }

  return !PLACEHOLDER_PATTERN.test(value.trim());
}

export function getSafeText(value?: string | null) {
  return hasMeaningfulText(value) ? value!.trim() : null;
}

export function getSafePhoneHref(value?: string | null) {
  const phone = getSafeText(value);

  if (!phone) {
    return null;
  }

  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

export function getSafeEmailHref(value?: string | null) {
  const email = getSafeText(value);
  return email ? `mailto:${email}` : null;
}

export function getSafeExternalHref(value?: string | null) {
  const href = getSafeText(value);

  if (!href) {
    return null;
  }

  return /^https?:\/\//i.test(href) ? href : null;
}

export function getMeaningfulItems<T>(items: T[], getText: (item: T) => string | null | undefined) {
  return items.filter((item) => hasMeaningfulText(getText(item)));
}
