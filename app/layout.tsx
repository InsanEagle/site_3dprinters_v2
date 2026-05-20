import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { RequestModalProvider } from "@/components/shared/request-modal";
import { brandContent } from "@/data/content";
import { createOrganizationJsonLd } from "@/lib/seo-jsonld";
import "./globals.css";

export const metadata: Metadata = {
  title: brandContent.workingTitle,
  description: brandContent.shortDescription
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={createOrganizationJsonLd()} />
        <RequestModalProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </RequestModalProvider>
      </body>
    </html>
  );
}
