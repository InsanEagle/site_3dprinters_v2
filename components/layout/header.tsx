"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { brandContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafePhoneHref, getSafeText } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useRequestModal } from "@/components/shared/request-modal";

const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/custom", label: "Изготовление по образцу" },
  { href: "/3d-scan", label: "3D-сканирование" },
  { href: "/about", label: "О направлении" },
  { href: "/delivery", label: "Передача изделий" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" }
];

export function Header() {
  const pathname = usePathname();
  const { openModal } = useRequestModal();
  const companyName = getSafeText(siteConfig.name) ?? brandContent.workingTitle;
  const phone = getSafeText(siteConfig.phone);
  const phoneHref = getSafePhoneHref(siteConfig.phone);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex min-h-20 items-center gap-6 py-3">
        <Link href="/" className="shrink-0">
          <span className="block text-lg font-semibold text-ink">{companyName}</span>
          <span className="block text-xs uppercase tracking-[0.12em] text-body">Пластиковые детали и изделия на заказ</span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition hover:text-accent",
                pathname === item.href || pathname?.startsWith(`${item.href}/`) ? "text-ink" : "text-body"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {phone && phoneHref ? (
            <a href={phoneHref} className="hidden text-sm font-medium text-ink xl:block">
              {phone}
            </a>
          ) : null}
          <Button onClick={() => openModal({ title: "Оставить заявку", source: `header:${pathname}` })}>Оставить заявку</Button>
        </div>
      </Container>
      <div className="border-t border-line lg:hidden">
        <Container className="flex gap-4 overflow-x-auto py-3">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 text-sm font-medium text-body">
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
