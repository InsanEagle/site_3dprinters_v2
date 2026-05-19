import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createRequestAttachmentAccessToken, getRequestAttachmentAccessConfig } from "@/lib/request-attachment-access";
import { RequestAttachment } from "@/lib/request-submission";
import { readEnvText } from "@/lib/runtime-env";

function resolveStorageDir(envName: string, fallbackPath: string) {
  const configuredPath = readEnvText(envName);
  const storagePath = configuredPath || fallbackPath;

  return path.isAbsolute(storagePath) ? storagePath : path.join(process.cwd(), storagePath);
}

export const REQUEST_ATTACHMENTS_STORAGE_ROOT = resolveStorageDir("REQUEST_ATTACHMENTS_DIR", path.join("data", "request-attachments"));

function sanitizeFileStem(fileName: string) {
  const stem = path.parse(fileName).name.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "");
  return stem || "attachment";
}

function sanitizeExtension(fileName: string, contentType: string) {
  const ext = path.extname(fileName).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return ext;
  }

  if (contentType === "image/png") {
    return ".png";
  }

  if (contentType === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}

function toPosixPath(value: string) {
  return value.replaceAll(path.sep, "/");
}

function createRequestAttachmentDownloadPath(storageKey: string) {
  const normalizedKey = toPosixPath(storageKey).split("/").map(encodeURIComponent).join("/");
  const basePath = `/api/request-attachments/${normalizedKey}`;
  const accessConfig = getRequestAttachmentAccessConfig();

  if (!accessConfig.enabled) {
    return basePath;
  }

  const token = createRequestAttachmentAccessToken(storageKey);
  return `${basePath}?access=${encodeURIComponent(token)}`;
}

export function normalizeRequestAttachmentStorageKey(value: string) {
  const normalized = path.posix.normalize(value.trim().replaceAll("\\", "/")).replace(/^\/+/, "");

  if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
    return null;
  }

  return normalized;
}

export function resolveRequestAttachmentAbsolutePath(storageKey: string) {
  const normalizedKey = normalizeRequestAttachmentStorageKey(storageKey);

  if (!normalizedKey) {
    return null;
  }

  const absolutePath = path.resolve(REQUEST_ATTACHMENTS_STORAGE_ROOT, normalizedKey);
  const storageRoot = path.resolve(REQUEST_ATTACHMENTS_STORAGE_ROOT);

  if (!absolutePath.startsWith(storageRoot)) {
    return null;
  }

  return absolutePath;
}

export function getRequestAttachmentContentType(storageKey: string) {
  const extension = path.extname(storageKey).toLowerCase();

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

export async function saveRequestAttachments(files: File[], requestUrl: string): Promise<RequestAttachment[]> {
  if (!files.length) {
    return [];
  }

  const bucket = new Date().toISOString().slice(0, 10);
  const uploadDirectory = path.join(REQUEST_ATTACHMENTS_STORAGE_ROOT, bucket);
  await mkdir(uploadDirectory, { recursive: true });

  const origin = new URL(requestUrl).origin;
  const attachments: RequestAttachment[] = [];

  for (const file of files) {
    const extension = sanitizeExtension(file.name, file.type);
    const safeStem = sanitizeFileStem(file.name);
    const storedFileName = `${Date.now()}-${randomUUID()}-${safeStem}${extension}`;
    const absolutePath = path.join(uploadDirectory, storedFileName);
    const storageKey = toPosixPath(path.posix.join(bucket, storedFileName));
    const relativeUrl = createRequestAttachmentDownloadPath(storageKey);

    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

    attachments.push({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      storageKey,
      relativeUrl,
      url: new URL(relativeUrl, origin).toString()
    });
  }

  return attachments;
}

export async function removeSavedRequestAttachments(attachments: RequestAttachment[]) {
  if (!attachments.length) {
    return;
  }

  for (const attachment of attachments) {
    const absolutePath = resolveRequestAttachmentAbsolutePath(attachment.storageKey);

    if (!absolutePath) {
      continue;
    }

    await rm(absolutePath, { force: true });
  }
}
