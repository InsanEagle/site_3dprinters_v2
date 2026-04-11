import { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { RequestForm } from "@/components/shared/request-form";
import { SectionTitle } from "@/components/shared/section-title";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Контакты | AutoParts FDM",
  description: "Контакты компании, карточки связи, форма обращения и placeholder для карты."
};

export default function ContactsPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="Контакты"
          title="Связаться с производством"
          description="Контакты собраны в одном месте, а форма сразу ведет на страницу благодарности после mock-отправки."
        />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            {[
              { label: "Телефон", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
              { label: "Telegram", value: "TODO: ссылка на Telegram", href: siteConfig.telegram },
              { label: "WhatsApp", value: "TODO: ссылка на WhatsApp", href: siteConfig.whatsapp },
              { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { label: "Адрес", value: siteConfig.address },
              { label: "Режим работы", value: siteConfig.hours }
            ].map((item) => (
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
            ))}
            <div className="flex min-h-[220px] items-end rounded-3xl border border-dashed border-line bg-surface p-5">
              <p className="text-sm text-body">TODO: встроить карту или заменить на схему проезда.</p>
            </div>
          </div>
          <RequestForm
            source="contacts-page-form"
            title="Форма связи"
            description="После отправки пользователь переходит на `/thanks`. Позже можно подключить реальную отправку в email, Telegram, CRM или backend."
          />
        </div>
      </Container>
    </div>
  );
}

