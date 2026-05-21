import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { FeatureCards } from "@/components/shared/feature-cards";
import { HeroSection } from "@/components/shared/hero-section";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { homepageFeaturedProducts } from "@/data/site";
import { faqContent, homeContent, servicesContent, trustContent } from "@/data/content";
import { HomeActions } from "@/components/page/home-actions";

export default function HomePage() {
  const publishedTrustItems =
    trustContent.sectionMode === "hide_if_no_real_data" ? [] : [];
  const popularProducts = homepageFeaturedProducts.slice(0, 12);

  return (
    <>
      <HeroSection
        title={homeContent.heroTitle}
        description={homeContent.heroSubtitle}
        actions={<HomeActions />}
        badges={homeContent.heroBullets}
        aside={
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Старт для заказа</p>
            <h2 className="mt-4 text-2xl font-semibold text-ink">Можно начать даже без готовой модели</h2>
            <div className="mt-6 grid gap-4">
              {homeContent.whyItems.map((item) => (
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
          <SectionTitle
            eyebrow="О сайте"
            title="Изготовление пластиковых деталей и изделий на заказ"
            description="Сайт помогает выбрать направление работы, посмотреть типовые позиции каталога и быстро отправить заявку на оценку задачи."
          />
          <div className="rounded-[32px] border border-line bg-surface p-8">
            <p className="max-w-3xl text-base leading-7 text-body sm:text-lg">
              Сюда можно прийти с физическим образцом, фотографией, размерами или готовой 3D-моделью. Если данных пока немного, это не мешает начать с первичного запроса.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Что можно заказать" title={homeContent.introTitle} />
          <FeatureCards items={homeContent.introItems} />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Направления"
            title="Основные направления работы"
            description="Если нужной позиции нет в каталоге, это не ограничивает обращение. Ниже собраны типовые сценарии, с которыми можно начать работу."
          />
          <FeatureCards
            items={servicesContent.map((service) => ({
              title: service.title,
              description: service.shortText
            }))}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Каталог"
            title="Популярные позиции по заказам"
            description="Эти детали чаще всего заказывали на маркетплейсе. На сайте можно уточнить изготовление, наличие или подобрать похожий аналог под свою задачу."
            actions={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/catalog" variant="secondary">
                  Смотреть каталог
                </Button>
                <Button href="/contacts">
                  Оставить заявку
                </Button>
              </div>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {popularProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Задачи" title={homeContent.useCasesTitle} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homeContent.useCases.map((item) => (
              <article key={item} className="rounded-3xl border border-line bg-white p-6">
                <p className="text-lg font-semibold text-ink">{item}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Процесс" title={homeContent.processTitle} />
          <Timeline steps={homeContent.processSteps} />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Почему начать легко" title={homeContent.whyTitle} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homeContent.whyItems.map((item) => (
              <article key={item} className="rounded-3xl border border-line bg-white p-6">
                <p className="text-base font-semibold leading-7 text-ink">{item}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {publishedTrustItems.length ? (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionTitle eyebrow="Примеры" title="Кейсы и результаты" />
          </Container>
        </section>
      ) : null}

      <section className="border-t border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="FAQ"
            title="Частые вопросы"
            description="Если вы пока только оцениваете возможность изготовления, этот блок поможет быстрее понять, с чем можно обратиться."
            actions={<Button href="/faq" variant="secondary">Открыть весь FAQ</Button>}
          />
          <FAQAccordion items={faqContent.slice(0, 5)} />
        </Container>
      </section>

      <CTASection
        title="Можно начать с короткого описания задачи"
        description="Если у вас есть только фото, примерные размеры или идея будущего изделия, этого уже достаточно для первичной оценки."
        actions={<HomeActions cta />}
      />
    </>
  );
}
