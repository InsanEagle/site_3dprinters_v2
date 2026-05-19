"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { brandContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafePhoneHref, getSafeText } from "@/lib/content";
import { getHeaderRequestFormText } from "@/lib/request-ui";
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
  const { itemCount, isHydrated } = useCart();
  const { openModal } = useRequestModal();
  const companyName = getSafeText(siteConfig.name) ?? brandContent.workingTitle;
  const phone = getSafeText(siteConfig.phone);
  const phoneHref = getSafePhoneHref(siteConfig.phone);
  const headerCopy = getHeaderRequestFormText();
  const cartCountLabel = isHydrated ? itemCount : 0;
  const shouldShowCartLink = cartCountLabel > 0 || pathname === "/cart" || pathname === "/checkout";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex min-h-20 min-w-0 items-center gap-3 py-3 sm:gap-4 xl:gap-5">
        <Link href="/" className="min-w-0 flex-1 xl:flex-none xl:shrink-0">
          <span className="block truncate text-lg font-semibold text-ink">{companyName}</span>
          <span className="block truncate text-xs uppercase tracking-[0.12em] text-body">Пластиковые детали и изделия на заказ</span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-6">
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
        <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex xl:gap-3">
          {shouldShowCartLink ? (
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              aria-label={`Корзина, товаров: ${cartCountLabel}`}
            >
              <span>Корзина</span>
              <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-white px-2 py-1 text-xs text-body">
                {cartCountLabel}
              </span>
            </Link>
          ) : null}
          {phone && phoneHref ? (
            <a href={phoneHref} className="hidden text-sm font-medium text-ink xl:block">
              {phone}
            </a>
          ) : null}
          <Button onClick={() => openModal({ ...headerCopy, source: `header:${pathname}` })}>
            Оставить заявку
          </Button>
        </div>
      </Container>
      <div className="overflow-hidden border-t border-line xl:hidden">
        <Container className="flex min-w-0 gap-4 overflow-x-auto py-3">
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
