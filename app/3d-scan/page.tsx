import { Metadata } from "next";
import { ServiceHeroActions } from "@/components/page/service-hero-actions";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { FeatureCards } from "@/components/shared/feature-cards";
import { HeroSection } from "@/components/shared/hero-section";
import { RequestForm } from "@/components/shared/request-form";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { homeContent, servicesContent } from "@/data/content";
import { getScanFormText, getScanPhotoRequestFormText } from "@/lib/request-ui";
import { createServiceJsonLd } from "@/lib/seo-jsonld";

const service = servicesContent.find((item) => item.slug === "3d-scan")!;
const scanFormCopy = getScanFormText();
const scanPhotoCopy = getScanPhotoRequestFormText();

export const metadata: Metadata = {
  title: `${service.title} | Изготовление деталей`,
  description: service.shortText
};

export default function ScanPage() {
  const serviceJsonLd = createServiceJsonLd("3d-scan");

  return (
    <>
      {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}
      <HeroSection
        title={service.bodyTitle}
        description={service.bodyText}
        actions={
          <ServiceHeroActions
            source="scan"
            anchorId="scan-form"
            primaryLabel="Запросить оценку сканирования"
            secondaryLabel="Обсудить по фото"
            secondaryCopy={scanPhotoCopy}
            noteText="Если вы ищете уже понятную типовую позицию, удобнее начать с каталога, а сюда приходить для задач со сложной геометрией." noteLinkHref="/catalog" noteLinkLabel="Открыть каталог"
          />
        }
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
              <h2 className="text-2xl font-semibold text-ink">Когда лучше сначала открыть каталог</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Если задача уже сводится к поиску похожей типовой позиции, быстрее сначала посмотреть каталог. Сканирование полезно там, где нужен отдельный этап подготовки геометрии.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="#scan-form">Перейти к форме</Button>
                <Button href="/catalog" variant="secondary">Открыть каталог</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="scan-form" className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Форма" title="Основной сценарий страницы" description="Главное действие здесь — оставить запрос на оценку 3D-сканирования. Кнопка про фото остается как более мягкий вход в тот же сценарий, если еще рано заполнять основную форму." />
          <RequestForm source="scan-page-form" {...scanFormCopy} />
        </Container>
      </section>

      <CTASection
        title="Если нет готовой модели, можно начать с фотографии или образца"
        description="На этапе первичной оценки достаточно описать задачу и передать исходные данные в удобном формате. Если вам сначала нужен подбор типовой позиции, удобнее открыть каталог."
        actions={
          <>
            <Button href="#scan-form">Запросить оценку сканирования</Button>
            <Button href="/catalog" variant="secondary">Открыть каталог</Button>
          </>
        }
      />
    </>
  );
}

