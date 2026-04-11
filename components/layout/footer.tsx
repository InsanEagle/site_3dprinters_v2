import Link from "next/link";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/data/site";

const footerLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/custom", label: "Изготовление под заказ" },
  { href: "/3d-scan", label: "3D-сканирование" },
  { href: "/about", label: "О компании" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" }
];

export function Footer() {
  return (
    <footer className="bg-ink py-14 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold">{siteConfig.name}</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-gray-300">
              Производство 3D-печатных автомобильных деталей, изготовление под заказ и 3D-сканирование сложных элементов.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">Разделы</h3>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-200 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">Контакты</h3>
            <div className="mt-4 grid gap-3 text-sm text-gray-200">
              <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <a href={siteConfig.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <p>{siteConfig.address}</p>
              <p>{siteConfig.hours}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-400">
          © 2026 {siteConfig.shortName}. Все данные на сайте можно заменить на реальные через `data/site.ts`.
        </div>
      </Container>
    </footer>
  );
}

