import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/shared/category-grid";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { FeatureCards } from "@/components/shared/feature-cards";
import { HeroSection } from "@/components/shared/hero-section";
import { ProductCard } from "@/components/shared/product-card";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { categories, faqItems, homeCases, processSteps, products, siteConfig } from "@/data/site";
import { HomeActions } from "@/components/page/home-actions";

export default function HomePage() {
  return (
    <>
      <HeroSection
        title="3D-печатные детали для автомобилей и изготовление под заказ"
        description="Изготавливаем элементы салона и кузова, восстанавливаем редкие детали, выполняем 3D-сканирование и печать по образцу."
        actions={<HomeActions />}
        badges={["Собственное производство", "3D-сканирование деталей", "Изготовление под заказ"]}
        aside={
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Подход сайта</p>
            <h2 className="mt-4 text-2xl font-semibold text-ink">Спокойный технический интерфейс без лишнего шума</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-body">Каталог готовых изделий</p>
                <p className="mt-2 text-xl font-semibold text-ink">6 категорий</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-body">Связь</p>
                <p className="mt-2 text-xl font-semibold text-ink">{siteConfig.phone}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 sm:col-span-2">
                <p className="text-sm text-body">Если нужной детали нет в каталоге</p>
                <p className="mt-2 text-lg font-semibold text-ink">Принимаем задачи по фото, размерам, образцу и через 3D-сканирование</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Что мы предлагаем"
            title="Три понятных сценария для клиента"
            description="Сайт сразу объясняет, что вы можете купить готовую позицию, заказать изготовление с нуля или отправить деталь на 3D-сканирование."
          />
          <FeatureCards
            items={[
              {
                title: "Готовые детали для авто",
                description: "Каталог помогает быстро перейти к категориям и товарам, даже если ассортимент пока будет постепенно наполняться."
              },
              {
                title: "Изготовление под заказ",
                description: "Отдельная страница объясняет, когда услуга подходит и что лучше подготовить для оценки задачи."
              },
              {
                title: "3D-сканирование и восстановление",
                description: "Сценарий для редких, сложных и снятых с производства элементов, где важна точная цифровая основа."
              }
            ]}
          />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Категории" title="Популярные категории" description="Структура каталога уже подготовлена под автомобильные детали, а реальное наполнение можно расширять постепенно." />
          <CategoryGrid items={categories} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Каталог"
            title="Популярные товары"
            description="Пока это демонстрационные карточки с честными placeholder-данными. Они показывают, как будет выглядеть каталог после наполнения."
            actions={<Button href="/catalog" variant="secondary">Перейти в каталог</Button>}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 rounded-[32px] border border-line bg-white p-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Нестандартные задачи</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">Не нашли нужную деталь в каталоге?</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-body sm:text-lg">
                Изготовим по образцу, фото, размерам или выполним 3D-сканирование детали для последующего производства.
              </p>
            </div>
            <HomeActions compact />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Процесс" title="Как мы работаем" description="Без лишних обещаний: сайт показывает понятный и реалистичный сценарий работы от обращения до отправки." />
          <Timeline steps={processSteps} />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Почему мы" title="Почему выбирают нас" />
          <FeatureCards
            items={[
              { title: "Специализация на автодеталях", description: "Фокус сайта на автомобильных сценариях помогает говорить с клиентом на одном языке." },
              { title: "Собственное производство", description: "Отдельный блок на сайте подчеркивает, что за проектом стоит реальный производственный парк." },
              { title: "Восстановление редких элементов", description: "Подходит для ситуаций, когда деталь сложно найти или она снята с производства." },
              { title: "Единичные изделия и небольшие партии", description: "Важно для частных заказов, сервисных задач и повторяемых небольших серий." },
              { title: "Понятные сроки", description: "В проекте предусмотрены поля для реальных сроков без завышенных обещаний. TODO: заполнить после запуска." },
              { title: "Консультация по нестандартным задачам", description: "Через pop-up и формы пользователь может быстро отправить фото и описание без лишних шагов." }
            ]}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Примеры работ" title="Кейсы и примеры" description="Сейчас здесь честные заготовки. Когда появятся реальные фото и короткие описания, блок станет сильным аргументом доверия." />
          <div className="grid gap-6 lg:grid-cols-3">
            {homeCases.map((item) => (
              <article key={item.title} className="rounded-3xl border border-line bg-white p-6">
                <div className="mb-5 h-52 rounded-2xl border border-dashed border-line bg-surface" />
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-body">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="FAQ" title="Частые вопросы" description="Короткий блок на главной помогает снять базовые сомнения до перехода в каталог или к форме." actions={<Button href="/faq" variant="secondary">Открыть весь FAQ</Button>} />
          <FAQAccordion items={faqItems.slice(0, 5)} />
        </Container>
      </section>

      <CTASection
        title="Нужна готовая деталь или задача под заказ?"
        description="Сайт уже поддерживает оба сценария: быстрый переход в каталог и универсальную форму заявки для нестандартных запросов."
        actions={<HomeActions cta />}
      />
    </>
  );
}
