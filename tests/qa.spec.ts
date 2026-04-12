import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "path";

const sampleImagePath = path.join(process.cwd(), "tests", "fixtures", "sample-image.png");
const sampleNotePath = path.join(process.cwd(), "tests", "fixtures", "sample-note.txt");
const ordersDirPath = path.join(process.cwd(), "data", "orders");

async function findOrderRecordByNumber(orderNumber: string) {
  const entries = await readdir(ordersDirPath);

  for (const entry of entries) {
    if (!entry.endsWith(".json")) {
      continue;
    }

    const record = JSON.parse(await readFile(path.join(ordersDirPath, entry), "utf8")) as {
      orderNumber?: string;
      deliveryMethod?: string;
      deliveryLabel?: string;
      deliveryNote?: string;
      commercialNote?: string;
      items?: Array<{ name: string }>;
    };

    if (record.orderNumber === orderNumber) {
      return record;
    }
  }

  return undefined;
}

test("desktop: core routes, catalog filters, product, form error and thanks flow", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/");
  await expect(page).toHaveTitle(/изготовление|детал/i);

  await page.getByRole("link", { name: /каталог/i }).first().click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByRole("searchbox").fill("zzz");
  await page.getByRole("button", { name: /показать/i }).click();
  await expect(page.getByText(/Подходящих позиций/i)).toBeVisible();

  await page.getByRole("link", { name: /Сбросить фильтры/i }).click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByRole("link", { name: /Панели/i }).first().click();
  await expect(page).toHaveURL(/\/catalog\/panels/);

  await page.locator('a[href^="/product/"]').first().click();
  await expect(page).toHaveURL(/\/product\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("desktop: product page CTA opens request modal", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/product/dashboard-panel-replacement");
  await page.locator("main button").filter({ hasText: /Оставить заявку/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /Закрыть/i })).toBeVisible();
});

test("desktop: cart supports add, quantity change, subtotal and remove", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/catalog");

  const interiorCard = page.locator("article").filter({ hasText: /Накладка элемента салона/i });
  await interiorCard.getByRole("button", { name: /^В корзину$/i }).click();

  const fastenerCard = page.locator("article").filter({ hasText: /Комплект креплений/i });
  await fastenerCard.getByRole("button", { name: /^В корзину$/i }).click();

  await expect(page.getByRole("link", { name: /Корзина, товаров: 2/i })).toBeVisible();
  await page.getByRole("link", { name: /Корзина, товаров: 2/i }).click();

  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole("heading", { name: /Товары, выбранные для прямой покупки/i })).toBeVisible();
  await expect(page.getByText(/6.?700.*₽/i).first()).toBeVisible();
  await expect(page.getByText(/способы получения/i).first()).toBeVisible();

  const interiorItem = page.locator("article").filter({ hasText: /Накладка элемента салона/i });
  await interiorItem.getByRole("button", { name: /Увеличить количество/i }).click();
  await expect(page.getByText(/11.?600.*₽/i).first()).toBeVisible();

  const fastenerItem = page.locator("article").filter({ hasText: /Комплект креплений/i });
  await fastenerItem.getByRole("button", { name: /^Удалить$/i }).click();
  await expect(page.getByText(/9.?800.*₽/i).first()).toBeVisible();

  await interiorItem.getByRole("button", { name: /Уменьшить количество/i }).click();
  await expect(page.getByText(/4.?900.*₽/i).first()).toBeVisible();
});

test("desktop: checkout completes from cart to thanks", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/catalog");

  const interiorCard = page.locator("article").filter({ hasText: /Накладка элемента салона/i });
  await interiorCard.getByRole("button", { name: /^В корзину$/i }).click();

  const fastenerCard = page.locator("article").filter({ hasText: /Комплект креплений/i });
  await fastenerCard.getByRole("button", { name: /^В корзину$/i }).click();

  await page.getByRole("link", { name: /Корзина, товаров: 2/i }).click();
  await page.getByRole("link", { name: /Перейти к checkout/i }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("heading", { name: /Короткое оформление без регистрации/i })).toBeVisible();
  await expect(page.getByText(/6.?700.*₽/i).first()).toBeVisible();
  await expect(page.getByText(/способы получения/i).first()).toBeVisible();

  await page.getByLabel(/^Имя$/i).fill("Иван");
  await page.getByLabel(/Телефон, email или мессенджер/i).fill("+79990000000");
  await page.getByLabel(/^Город$/i).fill("Москва");
  await page.getByLabel(/Адрес доставки/i).fill("Тестовая улица, 1");
  await page.getByLabel(/Комментарий к заказу/i).fill("Нужен звонок перед отправкой.");
  await page.getByRole("button", { name: /^Оформить заказ$/i }).click();

  await expect(page).toHaveURL(/\/thanks\?source=checkout-page&kind=order&orderNumber=ORD-.*deliveryMethod=delivery/);
  await expect(page.getByText(/заказ принят в обработку/i)).toBeVisible();
  await expect(page.getByText(/Номер заказа:/i)).toBeVisible();
  await expect(page.getByText(/Стоимость и детали доставки/i)).toBeVisible();
});

test("desktop: pickup selection is stored in order snapshot", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/catalog");

  const interiorCard = page.locator("article").filter({ hasText: /Накладка элемента салона/i });
  await interiorCard.getByRole("button", { name: /^В корзину$/i }).click();

  await page.getByRole("link", { name: /Корзина, товаров: 1/i }).click();
  await page.getByRole("link", { name: /Перейти к checkout/i }).click();

  await page.getByRole("radio", { name: /Самовывоз/i }).check();
  await page.getByLabel(/^Имя$/i).fill("Иван");
  await page.getByLabel(/Телефон, email или мессенджер/i).fill("+79990000000");
  await page.getByLabel(/^Город$/i).fill("Москва");
  await page.getByLabel(/Адрес или ориентир/i).fill("Созвон перед выдачей");
  await page.getByRole("button", { name: /^Оформить заказ$/i }).click();

  await expect(page).toHaveURL(/\/thanks\?source=checkout-page&kind=order&orderNumber=ORD-.*deliveryMethod=pickup/);
  await expect(page.getByText(/Самовывоз и детали передачи/i)).toBeVisible();

  const orderNumberText = await page.getByText(/Номер заказа:/i).textContent();
  const orderNumber = orderNumberText?.match(/ORD-[A-Z0-9-]+/)?.[0];

  expect(orderNumber).toBeTruthy();

  const record = await findOrderRecordByNumber(orderNumber as string);

  expect(record).toBeTruthy();
  expect(record?.deliveryMethod).toBe("pickup");
  expect(record?.deliveryLabel).toMatch(/Самовывоз/i);
  expect(record?.deliveryNote).toMatch(/подтверждаем/i);
  expect(record?.commercialNote).toMatch(/shipping-расчета/i);
  expect(record?.items?.[0]?.name).toMatch(/Накладка/i);
});

test("desktop: contacts form completes thanks flow with photo", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/contacts");
  await page.getByLabel(/Имя/i).fill("Иван");
  await page.getByLabel(/Телефон|email|мессенджер/i).fill("+79990000000");
  await page.getByLabel(/Краткое описание задачи/i).fill("Нужна оценка детали для теста");
  await page.locator('input[type="file"]').setInputFiles(sampleImagePath);
  await expect(page.getByText(/sample-image\.png/i)).toBeVisible();
  await page.getByRole("button", { name: /^Отправить заявку$/i }).click();
  await expect(page).toHaveURL(/\/thanks\?source=/);
});

test("desktop: unsupported file type shows friendly validation", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/contacts");
  await page.locator('input[type="file"]').setInputFiles(sampleNotePath);
  await expect(page.locator("#request-file-error")).toContainText(/Поддерживаются только изображения формата/i);
});

test("desktop: checkout error keeps context on page", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await context.route("**/api/orders", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        code: "submission_unavailable",
        message: "Оформление заказа через сайт пока недоступно."
      })
    });
  });

  await page.goto("/catalog");
  const interiorCard = page.locator("article").filter({ hasText: /Накладка элемента салона/i });
  await interiorCard.getByRole("button", { name: /^В корзину$/i }).click();

  await page.getByRole("link", { name: /Корзина, товаров: 1/i }).click();
  await page.getByRole("link", { name: /Перейти к checkout/i }).click();

  await page.getByLabel(/^Имя$/i).fill("Иван");
  await page.getByLabel(/Телефон, email или мессенджер/i).fill("+79990000000");
  await page.getByLabel(/^Город$/i).fill("Москва");
  await page.getByLabel(/Адрес доставки/i).fill("Тестовая улица, 1");
  await page.getByRole("button", { name: /^Оформить заказ$/i }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/Оформление заказа через сайт пока недоступно/i)).toBeVisible();
  await expect(page.getByText(/Накладка элемента салона/i)).toBeVisible();
});

test("desktop: broken not-found routes show recovery actions", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/product/not-existing-product");
  await expect(page.getByText(/Страница не найдена/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Перейти в каталог/i })).toBeVisible();

  await page.goto("/catalog/not-existing-category");
  await expect(page.getByText(/Страница не найдена/i)).toBeVisible();
});

test("desktop: form error state is visible when API is unavailable", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await context.route("**/api/requests", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        code: "submission_unavailable",
        message: "Отправка через сайт пока недоступна."
      })
    });
  });

  await page.goto("/contacts");
  await page.getByLabel(/Имя/i).fill("Иван");
  await page.getByLabel(/Телефон|email|мессенджер/i).fill("+79990000000");
  await page.getByLabel(/Краткое описание задачи/i).fill("Нужна оценка детали для теста");
  await page.getByRole("button", { name: /^Отправить заявку$/i }).click();

  await expect(page.getByText(/Отправка через сайт пока недоступна/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Открыть контакты/i })).toBeVisible();
});

test("mobile: header, horizontal nav and catalog remain usable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only assertions.");

  await page.goto("/");
  await page.locator("header .overflow-x-auto a[href='/catalog']").click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByRole("searchbox").fill("panel");
  await page.getByRole("button", { name: /показать/i }).click({ force: true });
  await expect(page.locator('a[href^="/product/"]').first()).toBeVisible();
});

test("mobile: contacts form with photo remains usable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only assertions.");

  await page.goto("/contacts");
  await page.getByLabel(/Имя/i).fill("Иван");
  await page.getByLabel(/Телефон|email|мессенджер/i).fill("+79990000000");
  await page.getByLabel(/Краткое описание задачи/i).fill("Нужна оценка детали для мобильного теста");
  await page.locator('input[type="file"]').setInputFiles(sampleImagePath);
  await expect(page.getByText(/sample-image\.png/i)).toBeVisible();
  await page.getByRole("button", { name: /^Отправить заявку$/i }).click({ force: true });
  await expect(page).toHaveURL(/\/thanks\?source=/);
});
