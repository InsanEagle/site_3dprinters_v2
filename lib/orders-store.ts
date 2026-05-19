import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { isOrderStatus, normalizeOrderNotificationStatus, OrderNotificationChannelState, OrderRecord, OrderStatus } from "@/lib/order-submission";
import { readEnvText } from "@/lib/runtime-env";

function resolveStorageDir(envName: string, fallbackPath: string) {
  const configuredPath = readEnvText(envName);
  const storagePath = configuredPath || fallbackPath;

  return path.isAbsolute(storagePath) ? storagePath : path.join(process.cwd(), storagePath);
}

export const ORDERS_STORAGE_DIR = resolveStorageDir("ORDERS_DATA_DIR", path.join("data", "orders"));

type StoredOrderRecord = Partial<OrderRecord> & {
  managerNotification?: Partial<OrderRecord["managerNotification"]> & {
    status?: string;
  };
};

function getOrderFilePath(orderId: string) {
  return path.join(ORDERS_STORAGE_DIR, `${orderId}.json`);
}

async function ensureOrdersStorageDir() {
  await mkdir(ORDERS_STORAGE_DIR, { recursive: true });
}

function normalizeOrderRecord(record: StoredOrderRecord): OrderRecord {
  const normalizedNotificationStatus = normalizeOrderNotificationStatus(record.managerNotification?.status);
  const lastAttemptAt =
    record.managerNotification?.lastAttemptAt ??
    record.managerNotification?.deliveredAt ??
    (normalizedNotificationStatus === "delivery_failed" ? record.updatedAt : undefined);
  const attemptCount =
    typeof record.managerNotification?.attemptCount === "number" && Number.isFinite(record.managerNotification.attemptCount)
      ? Math.max(0, Math.floor(record.managerNotification.attemptCount))
      : normalizedNotificationStatus === "pending_delivery"
        ? 0
        : 1;

  return {
    ...(record as OrderRecord),
    status: isOrderStatus(record.status) ? record.status : "new",
    managerNotification: {
      channel: "webhook",
      status: normalizedNotificationStatus,
      deliveryTrigger:
        record.managerNotification?.deliveryTrigger === "retry"
          ? "retry"
          : "initial",
      attemptCount,
      lastAttemptAt,
      deliveredAt: record.managerNotification?.deliveredAt,
      lastError: record.managerNotification?.lastError,
      channels: Array.isArray(record.managerNotification?.channels)
        ? record.managerNotification.channels
            .map((channel) => {
              if (!channel || typeof channel !== "object") {
                return undefined;
              }

              const candidate = channel as {
                name?: unknown;
                label?: unknown;
                required?: unknown;
                configured?: unknown;
                ok?: unknown;
                status?: unknown;
                deliveredAt?: unknown;
                lastError?: unknown;
              };

              if (
                (candidate.name !== "primary" && candidate.name !== "messenger" && candidate.name !== "email" && candidate.name !== "sheets") ||
                typeof candidate.label !== "string" ||
                typeof candidate.required !== "boolean" ||
                typeof candidate.configured !== "boolean" ||
                typeof candidate.ok !== "boolean" ||
                typeof candidate.status !== "number"
              ) {
                return undefined;
              }

              return {
                name: candidate.name as OrderNotificationChannelState["name"],
                label: candidate.label,
                required: candidate.required,
                configured: candidate.configured,
                ok: candidate.ok,
                status: candidate.status,
                deliveredAt: typeof candidate.deliveredAt === "string" ? candidate.deliveredAt : undefined,
                lastError: typeof candidate.lastError === "string" ? candidate.lastError : undefined
              };
            })
            .filter((channel): channel is NonNullable<typeof channel> => Boolean(channel))
        : undefined
    }
  };
}

async function readOrderRecordFile(filePath: string) {
  return normalizeOrderRecord(JSON.parse(await readFile(filePath, "utf8")) as StoredOrderRecord);
}

export async function saveOrderRecord(record: OrderRecord) {
  await ensureOrdersStorageDir();
  const filePath = getOrderFilePath(record.id);
  const tempFilePath = `${filePath}.tmp`;

  await writeFile(tempFilePath, JSON.stringify(record, null, 2), "utf8");
  await rename(tempFilePath, filePath);

  return record;
}

export async function readOrderRecord(orderId: string) {
  return readOrderRecordFile(getOrderFilePath(orderId));
}

export async function findOrderRecord(orderId: string) {
  try {
    return await readOrderRecord(orderId);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listOrderRecords() {
  await ensureOrdersStorageDir();

  const entries = await readdir(ORDERS_STORAGE_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(ORDERS_STORAGE_DIR, entry.name));

  const records = await Promise.all(files.map((filePath) => readOrderRecordFile(filePath)));

  return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function findOrderRecordByIdempotencyKey(idempotencyKey: string) {
  const records = await listOrderRecords();

  return records.find((record) => record.idempotencyKey === idempotencyKey) ?? null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!isOrderStatus(status)) {
    throw new Error(`Unsupported order status: ${status}`);
  }

  const existingRecord = await readOrderRecord(orderId);

  if (existingRecord.status === status) {
    return existingRecord;
  }

  const nextRecord: OrderRecord = {
    ...existingRecord,
    status,
    updatedAt: new Date().toISOString()
  };

  await saveOrderRecord(nextRecord);

  return nextRecord;
}
