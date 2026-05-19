import { defineConfig, devices } from "@playwright/test";
import { e2eOrdersDir, e2eRequestAttachmentsDir } from "./tests/e2e-storage";

const port = 3011;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  globalSetup: "./tests/e2e-global-setup.ts",
  globalTeardown: "./tests/e2e-global-teardown.ts",
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
      command:
        "powershell -NoProfile -Command \"npm.cmd run build; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; Copy-Item -Path '.next/static' -Destination '.next/standalone/.next/static' -Recurse -Force; Copy-Item -Path 'public' -Destination '.next/standalone/public' -Recurse -Force; node '.next/standalone/server.js'\"",
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        PORT: String(port),
        REQUESTS_WEBHOOK_URL: "http://127.0.0.1:3999/",
        NEXT_PUBLIC_SITE_NAME: "Smoke Test Site",
        REQUEST_ATTACHMENTS_ACCESS_SECRET: "test-request-attachments-secret",
        ORDERS_DATA_DIR: e2eOrdersDir,
        REQUEST_ATTACHMENTS_DIR: e2eRequestAttachmentsDir,
        INTERNAL_BACKOFFICE_PASSWORD: "test-backoffice-password",
        INTERNAL_BACKOFFICE_SESSION_SECRET: "test-backoffice-secret",
        ORDER_PUBLIC_ACCESS_SECRET: "test-order-public-secret"
      }
    }
  ]
});
