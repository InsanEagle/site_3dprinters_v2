import { Metadata } from "next";
import { ServiceHeroActions } from "@/components/page/service-hero-actions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCards } from "@/components/shared/feature-cards";
import { HeroSection } from "@/components/shared/hero-section";
import { RequestForm } from "@/components/shared/request-form";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { formContent, homeContent, servicesContent } from "@/data/content";

const service = servicesContent.find((item) => item.slug === "3d-scan")!;

export const metadata: Metadata = {
  title: `${service.title} | Изготовление деталей`,
  description: service.shortText
};

export default function ScanPage() {
  return (
    <>
      <HeroSection
        title={service.bodyTitle}
        description={service.bodyText}
        actions={<ServiceHeroActions source="scan" anchorId="scan-form" />}
        aside={
          <div className="rounded-[32px] border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Когда это подходит</p>
            <div className="mt-5 grid gap-3">
              {service.bullets.map((item) => (
                <div key={item} className="rounded-2xl bg-surface p-4 text-base font-medium text-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Что дает этап сканирования" title="Цифровая основа для дальнейшей работы" />
          <FeatureCards
            items={[
              { title: "Подготовка к изготовлению", description: "Цифровая модель может использоваться как этап перед доработкой и производством." },
              { title: "Работа со сложной геометрией", description: "Подходит в случаях, когда по фото или размерам трудно точно описать форму изделия." },
              { title: "Основа для доработки", description: "После подготовки цифровой модели можно обсуждать изменение конструкции и адаптацию под задачу." }
            ]}
          />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Процесс" title={homeContent.processTitle} />
          <Timeline steps={homeContent.processSteps} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что желательно подготовить</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                <li>Фотографии изделия с нескольких ракурсов</li>
                <li>Краткое описание задачи</li>
                <li>Размеры, если они известны</li>
                <li>Физический образец, если он сохранился</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что важно знать</h2>
              <p className="mt-4 text-base leading-7 text-body">
                3D-сканирование не всегда является единственным путем решения задачи. Иногда оно используется как промежуточный этап перед моделированием, доработкой и изготовлением.
              </p>
              <div className="mt-6">
                <Button href="#scan-form" variant="secondary">Перейти к форме</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="scan-form" className="py-16 sm:py-20">
        <Container>
          <RequestForm source="scan-page-form" title={formContent.titleDefault} description={formContent.introDefault} />
        </Container>
      </section>

      <CTASection
        title="Если нет готовой модели, можно начать с фотографии или образца"
        description="На этапе первичной оценки достаточно описать задачу и передать исходные данные в удобном формате."
        actions={<ServiceHeroActions source="scan-final" anchorId="scan-form" />}
      />
    </>
  );
}
