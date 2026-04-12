import { expect, test } from "@playwright/test";

test("desktop: core routes, catalog filters, product, form error and thanks flow", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/");
  await expect(page).toHaveTitle(/Изготовление|детал/i);

  await page.getByRole("link", { name: /каталог/i }).first().click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByRole("searchbox").fill("zzz");
  await page.getByRole("button", { name: /показать/i }).click();
  await expect(page.getByText(/Подходящих позиций/i)).toBeVisible();

  await page.getByRole("link", { name: /Сбросить фильтры/i }).click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByRole("link", { name: /Панели/i }).first().click();
  await expect(page).toHaveURL(/\/catalog\/panels/);

  await page.getByRole("link", { name: /Подробнее/i }).first().click();
  await expect(page).toHaveURL(/\/product\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("desktop: product page CTA opens request modal", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/product/dashboard-panel-replacement");
  await page.locator("main button").filter({ hasText: /Оставить заявку/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /Закрыть форму/i })).toBeVisible();
});

test("desktop: contacts form completes thanks flow", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only assertions.");

  await page.goto("/contacts");
  await page.getByLabel(/Имя/i).fill("Иван");
  await page.getByLabel(/Телефон|email|мессенджер/i).fill("+79990000000");
  await page.getByLabel(/Краткое описание задачи/i).fill("Нужна оценка детали для теста");
  await page.getByRole("button", { name: /^Отправить заявку$/i }).click();
  await expect(page).toHaveURL(/\/thanks\?source=/);
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
  await page.getByRole("button", { name: /показать/i }).click();
  await expect(page.getByRole("link", { name: /Подробнее/i }).first()).toBeVisible();
});
