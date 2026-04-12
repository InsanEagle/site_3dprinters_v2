import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { RequestAttachment } from "@/lib/request-submission";

const REQUEST_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "requests");

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

function toRelativeUploadUrl(relativeUrl: string) {
  return relativeUrl.replaceAll(path.sep, "/");
}

export async function saveRequestAttachments(files: File[], requestUrl: string): Promise<RequestAttachment[]> {
  if (!files.length) {
    return [];
  }

  const bucket = new Date().toISOString().slice(0, 10);
  const uploadDirectory = path.join(REQUEST_UPLOAD_ROOT, bucket);
  await mkdir(uploadDirectory, { recursive: true });

  const origin = new URL(requestUrl).origin;
  const attachments: RequestAttachment[] = [];

  for (const file of files) {
    const extension = sanitizeExtension(file.name, file.type);
    const safeStem = sanitizeFileStem(file.name);
    const storedFileName = `${Date.now()}-${randomUUID()}-${safeStem}${extension}`;
    const absolutePath = path.join(uploadDirectory, storedFileName);
    const relativeUrl = toRelativeUploadUrl(path.join("/uploads/requests", bucket, storedFileName));

    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

    attachments.push({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
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
    const relativePath = attachment.relativeUrl.replace(/^\//, "");
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const uploadRoot = path.resolve(REQUEST_UPLOAD_ROOT);

    if (!absolutePath.startsWith(uploadRoot)) {
      continue;
    }

    await rm(absolutePath, { force: true });
  }
}
