import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";

export const e2eStorageRoot = path.join(process.cwd(), "tmp", "e2e");
export const e2eOrdersDir = path.join(e2eStorageRoot, "orders");
export const e2eRequestAttachmentsDir = path.join(e2eStorageRoot, "request-attachments");
export const mockWebhookLogPath = path.join(e2eStorageRoot, "mock-webhook.jsonl");

export function resetE2eStorage() {
  rmSync(e2eStorageRoot, { recursive: true, force: true });
  mkdirSync(e2eOrdersDir, { recursive: true });
  mkdirSync(e2eRequestAttachmentsDir, { recursive: true });
}
