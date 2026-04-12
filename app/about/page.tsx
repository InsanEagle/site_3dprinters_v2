import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCards } from "@/components/shared/feature-cards";
import { SectionTitle } from "@/components/shared/section-title";
import { aboutContent, brandContent, servicesContent, trustContent } from "@/data/content";

export const metadata: Metadata = {
  title: "О направлении работы | Изготовление деталей",
  description: aboutContent.text
};

export default function AboutPage() {
  const publishedTrustItems = trustContent.sectionMode === "hide_if_no_real_data" ? [] : [];

  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="О направлении работы" title={aboutContent.title} description={aboutContent.text} />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border border-line bg-surface p-8">
              <h2 className="text-2xl font-semibold text-ink">На что ориентирован сайт</h2>
              <p className="mt-4 text-base leading-7 text-body">{brandContent.shortDescription}</p>
            </div>
            <div className="rounded-[32px] border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что уже заложено в структуру</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                {aboutContent.points.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Направления"
            title="С какими задачами можно обратиться"
            description="Основной фокус — практичные детали, доработка существующих изделий и подготовка моделей для изготовления."
          />
          <FeatureCards
            items={servicesContent.map((service) => ({
              title: service.title,
              description: service.shortText
            }))}
          />
        </Container>
      </section>

      {publishedTrustItems.length ? (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionTitle eyebrow="Доверие" title="Подтвержденные примеры работ" />
          </Container>
        </section>
      ) : null}

      <CTASection
        title="Если хотите обсудить задачу до заказа, начнем с заявки"
        description="Сайт подходит и для вопросов по типовым изделиям, и для нестандартных задач, где нужно изготовление по образцу, фото или модели."
        actions={<Button href="/contacts">Перейти в контакты</Button>}
      />
    </>
  );
}
