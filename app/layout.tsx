import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { RequestModalProvider } from "@/components/shared/request-modal";
import { brandContent } from "@/data/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: brandContent.workingTitle,
  description: brandContent.shortDescription
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <RequestModalProvider>
          <SiteShell>{children}</SiteShell>
        </RequestModalProvider>
      </body>
    </html>
  );
}
