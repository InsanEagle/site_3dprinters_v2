import { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { RequestForm } from "@/components/shared/request-form";
import { SectionTitle } from "@/components/shared/section-title";
import { contactsContent, formContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafeEmailHref, getSafeExternalHref, getSafePhoneHref, getSafeText } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты | Изготовление деталей",
  description: contactsContent.intro
};

export default function ContactsPage() {
  const contacts = [
    { label: "Телефон", value: getSafeText(siteConfig.phone), href: getSafePhoneHref(siteConfig.phone) },
    { label: "Telegram", value: "Telegram", href: getSafeExternalHref(siteConfig.telegram) },
    { label: "WhatsApp", value: "WhatsApp", href: getSafeExternalHref(siteConfig.whatsapp) },
    { label: "Email", value: getSafeText(siteConfig.email), href: getSafeEmailHref(siteConfig.email) },
    { label: "Адрес", value: getSafeText(siteConfig.address) },
    { label: "Режим работы", value: getSafeText(siteConfig.hours) }
  ].filter((item) => item.value || item.href);

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle eyebrow="Контакты" title={contactsContent.title} description={contactsContent.intro} />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            {contacts.length ? (
              contacts.map((item) => (
                <article key={item.label} className="rounded-3xl border border-line bg-white p-6">
                  <p className="text-sm font-medium text-body">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="mt-2 block text-lg font-semibold text-ink">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
                  )}
                </article>
              ))
            ) : (
              <article className="rounded-3xl border border-line bg-white p-6">
                <p className="text-sm font-medium text-body">{contactsContent.fallbackBlockTitle}</p>
                <p className="mt-3 text-base leading-7 text-body">{contactsContent.fallbackBlockText}</p>
              </article>
            )}
          </div>
          <RequestForm source="contacts-page-form" title={formContent.titleDefault} description={formContent.introDefault} />
        </div>
      </Container>
    </div>
  );
}
