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
import { homeContent, servicesContent } from "@/data/content";
import { getCustomFormText, getCustomPhotoRequestFormText } from "@/lib/request-ui";

const service = servicesContent.find((item) => item.slug === "custom")!;
const customFormCopy = getCustomFormText();
const customPhotoCopy = getCustomPhotoRequestFormText();

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
        actions={
          <ServiceHeroActions
            source="custom"
            anchorId="custom-form"
            primaryLabel="Открыть форму по образцу"
            secondaryLabel="Обсудить по фото"
            secondaryCopy={customPhotoCopy}
            noteText="Если вы ищете типовую или похожую позицию, удобнее сначала проверить каталог." noteLinkHref="/catalog" noteLinkLabel="Открыть каталог"
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
          <SectionTitle eyebrow="Роль страницы" title="Это сценарий для нетиповых задач, а не замена каталогу" description="Страница помогает начать работу, когда нужной позиции нет в каталоге или требуется повторение детали по образцу, фото или размерам." />
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Когда оставаться здесь</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Этот сценарий подходит, если нужно повторить, восстановить или доработать конкретную деталь, а не выбрать типовую позицию из каталога.
              </p>
              <div className="mt-6">
                <Button href="#custom-form">Перейти к форме по образцу</Button>
              </div>
            </article>
            <article className="rounded-3xl border border-line bg-surface p-8">
              <h2 className="text-2xl font-semibold text-ink">Когда лучше начать с каталога</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Если вы только подбираете похожую типовую позицию или хотите сначала посмотреть примеры товаров, быстрее начать с каталога, а к этой странице вернуться при необходимости.
              </p>
              <div className="mt-6">
                <Button href="/catalog" variant="secondary">Сначала посмотреть каталог</Button>
              </div>
            </article>
          </div>
        </Container>
      </section>

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

      <section id="custom-form" className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Форма" title="Основной сценарий страницы" description="Главное действие здесь — оставить запрос по образцу или нетиповой детали. Если удобнее начать с фотографии, можно использовать соседнюю кнопку в верхнем блоке." />
          <RequestForm source="custom-page-form" {...customFormCopy} />
        </Container>
      </section>

      <CTASection
        title="Если деталь повреждена или ее трудно найти, начните с описания задачи"
        description="Можно приложить фото, размеры, образец или готовую модель. Если сначала хотите посмотреть типовые позиции, удобнее открыть каталог, а затем вернуться к сценарию по образцу."
        actions={
          <>
            <Button href="#custom-form">Открыть форму по образцу</Button>
            <Button href="/catalog" variant="secondary">Сначала посмотреть каталог</Button>
          </>
        }
      />
    </>
  );
}

