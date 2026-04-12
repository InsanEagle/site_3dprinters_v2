import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { OrderRecord } from "@/lib/order-submission";

export const ORDERS_STORAGE_DIR = path.join(process.cwd(), "data", "orders");

function getOrderFilePath(orderId: string) {
  return path.join(ORDERS_STORAGE_DIR, `${orderId}.json`);
}

async function ensureOrdersStorageDir() {
  await mkdir(ORDERS_STORAGE_DIR, { recursive: true });
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
  const fileContent = await readFile(getOrderFilePath(orderId), "utf8");
  return JSON.parse(fileContent) as OrderRecord;
}

export async function listOrderRecords() {
  await ensureOrdersStorageDir();

  const entries = await readdir(ORDERS_STORAGE_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(ORDERS_STORAGE_DIR, entry.name));

  const records = await Promise.all(
    files.map(async (filePath) => JSON.parse(await readFile(filePath, "utf8")) as OrderRecord)
  );

  return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
