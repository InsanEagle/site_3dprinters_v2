import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { RequestModalProvider } from "@/components/shared/request-modal";
import { siteConfig } from "@/data/site";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: `${siteConfig.shortName} | 3D-печатные автодетали и изготовление под заказ`,
  description:
    "MVP сайта для компании, которая продает 3D-печатные автомобильные детали, изготавливает изделия под заказ и выполняет 3D-сканирование."
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

