import { defineConfig, devices } from "@playwright/test";

const port = 3001;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        browserName: "chromium"
      }
    }
  ],
  webServer: [
    {
      command: "node tests/mock-webhook.cjs",
      url: "http://127.0.0.1:3999/health",
      reuseExistingServer: true,
      timeout: 30_000
    },
    {
      command: "npm.cmd run dev",
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        PORT: String(port),
        REQUESTS_WEBHOOK_URL: "http://127.0.0.1:3999/",
        NEXT_PUBLIC_SITE_NAME: "Изготовление деталей"
      }
    }
  ]
});
