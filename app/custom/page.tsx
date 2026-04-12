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

const service = servicesContent.find((item) => item.slug === "custom")!;

export const metadata: Metadata = {
  title: `${service.title} | Изготовление деталей`,
  description: service.shortText
};

export default function CustomPage() {
  return (
    <>
      <HeroSection
        title={service.bodyTitle}
        description={service.bodyText}
        actions={<ServiceHeroActions source="custom" anchorId="custom-form" />}
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
          <SectionTitle eyebrow="Что можно прислать" title="С чего начать оценку" />
          <FeatureCards
            items={[
              { title: "Образец детали", description: "Если сохранилась физическая деталь, этого часто достаточно для первичной оценки." },
              { title: "Фото и размеры", description: "Если образца нет, можно начать с фотографий, примерных размеров и описания задачи." },
              { title: "Готовая модель", description: "Если цифровая модель уже есть, можно быстрее перейти к обсуждению изготовления." }
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
              <h2 className="text-2xl font-semibold text-ink">Что важно учитывать</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Возможность повторения зависит от геометрии, состояния исходной детали, требований к установке и условий эксплуатации будущего изделия.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Если данных пока мало</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Это не мешает начать. Для первичной оценки часто достаточно описания проблемы, нескольких фотографий и примерного назначения детали.
              </p>
              <div className="mt-6">
                <Button href="#custom-form" variant="secondary">Перейти к форме</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="custom-form" className="py-16 sm:py-20">
        <Container>
          <RequestForm source="custom-page-form" title={formContent.titleDefault} description={formContent.introDefault} />
        </Container>
      </section>

      <CTASection
        title="Если деталь повреждена или ее трудно найти, начните с описания задачи"
        description="Можно приложить фото, размеры, образец или готовую модель. Дальше мы поможем уточнить, какой путь работы подойдет лучше."
        actions={<ServiceHeroActions source="custom-final" anchorId="custom-form" />}
      />
    </>
  );
}
