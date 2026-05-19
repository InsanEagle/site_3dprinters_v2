import { defineConfig, devices } from "@playwright/test";

const port = 3011;

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
      name: "smoke-chromium",
      use: { ...devices["Desktop Chrome"] }
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
      command: "npm.cmd run build && npm.cmd run start",
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: true,
      timeout: 180_000,
      env: {
        PORT: String(port),
        REQUESTS_WEBHOOK_URL: "http://127.0.0.1:3999/",
        NEXT_PUBLIC_SITE_NAME: "Smoke Test Site",
        REQUEST_ATTACHMENTS_ACCESS_SECRET: "test-request-attachments-secret",
        INTERNAL_BACKOFFICE_PASSWORD: "test-backoffice-password",
        INTERNAL_BACKOFFICE_SESSION_SECRET: "test-backoffice-secret",
        ORDER_PUBLIC_ACCESS_SECRET: "test-order-public-secret"
      }
    }
  ]
});
