import { expect, test } from "@playwright/test";
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const sampleImagePath = path.join(process.cwd(), "tests", "fixtures", "sample-image.png");
const ordersDirPath = path.join(process.cwd(), "data", "orders");
const internalPassword = "test-backoffice-password";
const sampleProductSlug = "konsol-vozduhovod-dlya-avtomobilya-toyota-mark-2-cresta-chaser-kuzov-jzx100-kanc474";
const sampleProductSku = "KANC474";

type OrderFixture = {
  id: string;
  orderNumber: string;
};

async function writeOrderFixture(orderId: string) {
  const record = {
    id: orderId,
    orderNumber: `ORD-${orderId.toUpperCase()}`,
    status: "new",
    createdAt: "2026-04-17T10:00:00.000Z",
    updatedAt: "2026-04-17T10:00:00.000Z",
    source: "checkout-page",
    customerName: "Smoke Test Customer",
    customerContact: "+79990000000",
    city: "Moscow",
    address: "Pickup point",
    comment: "Smoke test order",
    deliveryMethod: "pickup",
    deliveryLabel: "Самовывоз",
    deliveryNote: "Передача заказа согласовывается отдельно.",
    subtotal: 4900,
    currency: "RUB",
    commercialNote: "Стоимость подтверждается менеджером.",
    fulfillmentNote: "Следующий шаг подтверждается вручную.",
    items: [
      {
        productSlug: sampleProductSlug,
        sku: sampleProductSku,
        name: "Консоль-воздуховод Toyota Mark 2 / Cresta / Chaser JZX100",
        quantity: 1,
        unitPrice: 4900,
        lineTotal: 4900,
        orderId
      }
    ],
    managerNotification: {
      channel: "webhook",
      status: "delivered",
      deliveredAt: "2026-04-17T10:01:00.000Z"
    }
  };

  await writeFile(path.join(ordersDirPath, `${orderId}.json`), JSON.stringify(record, null, 2), "utf8");

  return record satisfies OrderFixture;
}

async function countRequestAttachmentFiles(root = path.join(process.cwd(), "data", "request-attachments")): Promise<number> {
  let total = 0;
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      total += await countRequestAttachmentFiles(fullPath);
      continue;
    }

    total += 1;
  }

  return total;
}

async function getLatestRequestAttachmentFile(root = path.join(process.cwd(), "data", "request-attachments")): Promise<string | undefined> {
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      const nested = await getLatestRequestAttachmentFile(fullPath);

      if (nested) {
        files.push(nested);
      }

      continue;
    }

    files.push(fullPath);
  }

  if (!files.length) {
    return undefined;
  }

  const stats = await Promise.all(
    files.map(async (filePath) => ({
      filePath,
      modifiedAt: (await stat(filePath)).mtimeMs
    }))
  );

  return stats.sort((left, right) => right.modifiedAt - left.modifiedAt)[0]?.filePath;
}

test("smoke: home and catalog stay reachable without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /Каталог/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Оставить заявку" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Корзина/ })).toHaveCount(0);
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();

  await page.goto("/catalog");
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.getByTestId("catalog-filters-form")).toBeVisible();
  await expect(page.getByTestId(`product-card-${sampleProductSlug}`)).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
});

test("smoke: catalog filtering opens the current product page", async ({ page }) => {
  await page.goto("/catalog");

  await page.getByTestId("catalog-search-input").fill(sampleProductSku);
  await page.getByTestId("catalog-category-select").selectOption("panels");
  await page.getByTestId("catalog-apply-filters").click();

  await expect(page).toHaveURL(/\/catalog\?q=KANC474&category=panels/);
  await expect(page.getByTestId(`product-card-${sampleProductSlug}`)).toBeVisible();

  await page.locator(`[data-testid="product-card-${sampleProductSlug}"] a[href="/product/${sampleProductSlug}"]`).first().click();
  await expect(page).toHaveURL(`/product/${sampleProductSlug}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Подобрать аналог" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Уточнить по товару" })).toBeVisible();
  await expect(page.getByTestId(`add-to-cart-${sampleProductSlug}`)).toHaveCount(0);
});

test("smoke: request form submits successfully with an image", async ({ page }) => {
  let createdAttachmentFile: string | undefined;
  const fileCountBefore = await countRequestAttachmentFiles();

  try {
    await page.goto("/contacts");
    await expect(page.getByTestId("request-form-contacts-page-form")).toBeVisible();

    await page.getByTestId("request-name").fill("Иван");
    await page.getByTestId("request-contact").fill("+79990000000");
    await page.getByTestId("request-details").fill("Нужна оценка изготовления детали.");
    await page.getByTestId("request-files").setInputFiles(sampleImagePath);
    await page.getByTestId("request-submit").click();

    await expect(page).toHaveURL(/\/thanks\?source=contacts-page-form/);
    await expect.poll(async () => countRequestAttachmentFiles()).toBeGreaterThan(fileCountBefore);
    createdAttachmentFile = await getLatestRequestAttachmentFile();
    expect(createdAttachmentFile).toBeTruthy();
  } finally {
    if (createdAttachmentFile) {
      await rm(createdAttachmentFile, { force: true });
    }
  }
});

test("smoke: cart and checkout reflect the inquiry-first launch model", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Сейчас основной сценарий сайта — запрос и подбор" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Перейти в каталог" })).toBeVisible();

  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Основной сценарий первого запуска — не onsite checkout" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Перейти в каталог" })).toBeVisible();
});

test("smoke: internal login opens orders list and updates order status", async ({ page }) => {
  const orderId = `smoke-backoffice-${Date.now()}`;
  const orderPath = path.join(ordersDirPath, `${orderId}.json`);

  await writeOrderFixture(orderId);

  try {
    await page.goto("/internal/login");
    await page.getByTestId("internal-login-password").fill(internalPassword);
    await page.getByTestId("internal-login-submit").click();

    await expect(page).toHaveURL(/\/internal\/orders/);
    await expect(page.getByTestId("internal-orders-page")).toBeVisible();

    await page.getByTestId(`internal-order-row-${orderId}`).click();
    await expect(page).toHaveURL(new RegExp(`/internal/orders/${orderId}$`));

    await page.getByTestId("internal-order-status-select").selectOption("processing");
    await page.getByTestId("internal-order-status-submit").click();

    await expect(page).toHaveURL(new RegExp(`/internal/orders/${orderId}\\?updated=1$`));
    await expect(page.getByTestId("internal-order-updated")).toBeVisible();
    await expect(page.getByTestId("internal-order-public-link")).toBeVisible();

    const updatedRecord = JSON.parse(await readFile(orderPath, "utf8")) as { status: string };
    expect(updatedRecord.status).toBe("processing");

    await page.getByTestId("internal-logout-submit").click();
    await expect(page).toHaveURL(/\/internal\/login$/);
  } finally {
    await rm(orderPath, { force: true });
  }
});

test("smoke: public order status opens with a valid access link", async ({ page }) => {
  const orderId = `smoke-public-${Date.now()}`;
  const orderPath = path.join(ordersDirPath, `${orderId}.json`);
  const fixture = await writeOrderFixture(orderId);

  try {
    await page.goto("/internal/login");
    await page.getByTestId("internal-login-password").fill(internalPassword);
    await page.getByTestId("internal-login-submit").click();
    await expect(page).toHaveURL(/\/internal\/orders/);

    await page.getByTestId(`internal-order-row-${orderId}`).click();
    const publicLink = await page.getByTestId("internal-order-public-link").getAttribute("href");

    expect(publicLink).toBeTruthy();

    await page.goto(publicLink as string);
    await expect(page.getByTestId("public-order-status-page")).toBeVisible();
    await expect(page.getByTestId("public-order-number")).toHaveText(fixture.orderNumber);
  } finally {
    await rm(orderPath, { force: true });
  }
});
