import Link from "next/link";
import { Container } from "@/components/shared/container";
import { brandContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafeEmailHref, getSafeExternalHref, getSafePhoneHref, getSafeText } from "@/lib/content";

const footerLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/custom", label: "Изготовление по образцу" },
  { href: "/3d-scan", label: "3D-сканирование" },
  { href: "/about", label: "О направлении" },
  { href: "/delivery", label: "Передача изделий" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
  { href: "/policy", label: "Политика обработки данных" }
];

export function Footer() {
  const companyName = getSafeText(siteConfig.name) ?? brandContent.workingTitle;
  const phone = getSafeText(siteConfig.phone);
  const phoneHref = getSafePhoneHref(siteConfig.phone);
  const email = getSafeText(siteConfig.email);
  const emailHref = getSafeEmailHref(siteConfig.email);
  const telegramHref = getSafeExternalHref(siteConfig.telegram);
  const whatsappHref = getSafeExternalHref(siteConfig.whatsapp);
  const address = getSafeText(siteConfig.address);
  const hours = getSafeText(siteConfig.hours);

  const contactItems = [
    phone && phoneHref ? <a key="phone" href={phoneHref}>{phone}</a> : null,
    email && emailHref ? <a key="email" href={emailHref}>{email}</a> : null,
    telegramHref ? <a key="telegram" href={telegramHref} target="_blank" rel="noreferrer">Telegram</a> : null,
    whatsappHref ? <a key="whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a> : null,
    address ? <p key="address">{address}</p> : null,
    hours ? <p key="hours">{hours}</p> : null
  ].filter(Boolean);

  return (
    <footer className="bg-ink py-14 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold">{companyName}</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-gray-300">{brandContent.shortDescription}</p>
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
              {contactItems.length ? contactItems : <p>Контакты еще не опубликованы. Оставить запрос можно через форму на сайте.</p>}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-400">(c) 2026 {siteConfig.shortName}.</div>
      </Container>
    </footer>
  );
}
