import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { hasInternalAccess } from "@/lib/internal-access";
import { hasRequestAttachmentAccess } from "@/lib/request-attachment-access";
import {
  getRequestAttachmentContentType,
  normalizeRequestAttachmentStorageKey,
  resolveRequestAttachmentAbsolutePath
} from "@/lib/request-attachments";

function createFileNameHeaderValue(storageKey: string) {
  const fileName = path.basename(storageKey);
  return `inline; filename="${fileName.replace(/"/g, "")}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ attachment: string[] }>;
  }
) {
  const { attachment } = await context.params;
  const storageKey = normalizeRequestAttachmentStorageKey(attachment.join("/"));

  if (!storageKey) {
    return NextResponse.json({ ok: false, message: "Attachment not found." }, { status: 404 });
  }

  const accessToken = new URL(request.url).searchParams.get("access") ?? undefined;
  const hasInternalSession = await hasInternalAccess();
  const hasSignedAccess = hasRequestAttachmentAccess(storageKey, accessToken);

  if (!hasInternalSession && !hasSignedAccess) {
    return NextResponse.json({ ok: false, message: "Attachment access denied." }, { status: 403 });
  }

  const absolutePath = resolveRequestAttachmentAbsolutePath(storageKey);

  if (!absolutePath) {
    return NextResponse.json({ ok: false, message: "Attachment not found." }, { status: 404 });
  }

  try {
    const fileBuffer = await readFile(absolutePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": getRequestAttachmentContentType(storageKey),
        "Content-Disposition": createFileNameHeaderValue(storageKey),
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Attachment not found." }, { status: 404 });
  }
}
