import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { RequestModalProvider } from "@/components/shared/request-modal";
import { brandContent } from "@/data/content";
import "./globals.css";

export const metadata: Metadata = {
  title: brandContent.workingTitle,
  description: brandContent.shortDescription
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <RequestModalProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </RequestModalProvider>
      </body>
    </html>
  );
}
