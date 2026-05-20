import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OperationsChannelResult } from "@/lib/operations-notifications";
import type { RequestAttachment, RequestSubmissionPayload } from "@/lib/request-submission";
import { readEnvText } from "@/lib/runtime-env";

function resolveStorageDir(envName: string, fallbackPath: string) {
  const configuredPath = readEnvText(envName);
  const storagePath = configuredPath || fallbackPath;

  return path.isAbsolute(storagePath) ? storagePath : path.join(process.cwd(), storagePath);
}

export const REQUESTS_STORAGE_DIR = resolveStorageDir("REQUESTS_DATA_DIR", path.join("data", "requests"));

export type RequestDeliveryStatus = "delivered" | "delivery_failed";

export type RequestRecord = {
  id: string;
  createdAt: string;
  source: string;
  name: string;
  contact: string;
  brand?: string;
  model?: string;
  details: string;
  productName?: string;
  attachments: RequestAttachment[];
  managerNotification: {
    channel: "webhook";
    status: RequestDeliveryStatus;
    deliveredAt?: string;
    channels?: OperationsChannelResult[];
  };
};

function getRequestFilePath(requestId: string) {
  return path.join(REQUESTS_STORAGE_DIR, `${requestId}.json`);
}

async function ensureRequestsStorageDir() {
  await mkdir(REQUESTS_STORAGE_DIR, { recursive: true });
}

function normalizeRequestRecord(record: Partial<RequestRecord>): RequestRecord {
  return {
    id: typeof record.id === "string" ? record.id : "unknown-request",
    createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date(0).toISOString(),
    source: typeof record.source === "string" ? record.source : "unknown",
    name: typeof record.name === "string" ? record.name : "",
    contact: typeof record.contact === "string" ? record.contact : "",
    brand: typeof record.brand === "string" ? record.brand : undefined,
    model: typeof record.model === "string" ? record.model : undefined,
    details: typeof record.details === "string" ? record.details : "",
    productName: typeof record.productName === "string" ? record.productName : undefined,
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
    managerNotification: {
      channel: "webhook",
      status: record.managerNotification?.status === "delivery_failed" ? "delivery_failed" : "delivered",
      deliveredAt:
        typeof record.managerNotification?.deliveredAt === "string" ? record.managerNotification.deliveredAt : undefined,
      channels: Array.isArray(record.managerNotification?.channels) ? record.managerNotification.channels : undefined
    }
  };
}

async function readRequestRecordFile(filePath: string) {
  return normalizeRequestRecord(JSON.parse(await readFile(filePath, "utf8")) as Partial<RequestRecord>);
}

export function createRequestRecord(input: {
  requestId: string;
  createdAt: string;
  payload: RequestSubmissionPayload;
  deliveryStatus: RequestDeliveryStatus;
  channels?: OperationsChannelResult[];
}): RequestRecord {
  return {
    id: input.requestId,
    createdAt: input.createdAt,
    source: input.payload.source,
    name: input.payload.name,
    contact: input.payload.contact,
    brand: input.payload.brand,
    model: input.payload.model,
    details: input.payload.details,
    productName: input.payload.productName,
    attachments: input.payload.attachments ?? [],
    managerNotification: {
      channel: "webhook",
      status: input.deliveryStatus,
      deliveredAt: input.deliveryStatus === "delivered" ? input.createdAt : undefined,
      channels: input.channels
    }
  };
}

export async function saveRequestRecord(record: RequestRecord) {
  await ensureRequestsStorageDir();
  const filePath = getRequestFilePath(record.id);
  const tempFilePath = `${filePath}.tmp`;

  await writeFile(tempFilePath, JSON.stringify(record, null, 2), "utf8");
  await rename(tempFilePath, filePath);

  return record;
}

export async function readRequestRecord(requestId: string) {
  return readRequestRecordFile(getRequestFilePath(requestId));
}

export async function findRequestRecord(requestId: string) {
  try {
    return await readRequestRecord(requestId);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listRequestRecords() {
  await ensureRequestsStorageDir();

  const entries = await readdir(REQUESTS_STORAGE_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(REQUESTS_STORAGE_DIR, entry.name));

  const records = await Promise.all(files.map((filePath) => readRequestRecordFile(filePath)));

  return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
