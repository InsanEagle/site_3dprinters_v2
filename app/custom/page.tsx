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
import { processSteps } from "@/data/site";

export const metadata: Metadata = {
  title: "Изготовление под заказ | AutoParts FDM",
  description: "Страница услуги изготовления автомобильных деталей под заказ с понятным процессом и формой заявки."
};

export default function CustomPage() {
  return (
    <>
      <HeroSection
        title="Изготовление автомобильных деталей под заказ"
        description="Если нужной детали нет в продаже, она повреждена или снята с производства, мы можем изготовить её по образцу, фото, размерам или на основе 3D-сканирования."
        actions={<ServiceHeroActions source="custom" anchorId="custom-form" />}
        aside={
          <div className="rounded-[32px] border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Когда это подходит</p>
            <div className="mt-5 grid gap-3">
              {["Детали нет в продаже", "Деталь повреждена", "Нужен нестандартный элемент"].map((item) => (
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
          <SectionTitle eyebrow="Что можно изготовить" title="Подходящие типы изделий" />
          <FeatureCards
            items={[
              { title: "Элементы салона", description: "Рамки, накладки, панели, корпуса и другие интерьерные элементы." },
              { title: "Крепления и заглушки", description: "Практичные детали, которые часто ломаются или теряются в эксплуатации." },
              { title: "Детали кузова", description: "Отдельные пластиковые элементы, где важно аккуратно оценить применимость FDM-печати." },
              { title: "Корпуса и кожухи", description: "Функциональные изделия с понятной геометрией и понятной задачей по эксплуатации." },
              { title: "Редкие элементы", description: "Снятые с производства или труднонаходимые позиции под восстановление." },
              { title: "Единичные изделия и небольшие партии", description: "Подходит не только для одной детали, но и для повторяемых задач в малом тираже." }
            ]}
          />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Процесс" title="Как проходит работа" />
          <Timeline steps={processSteps} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что желательно подготовить</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                <li>Фото детали</li>
                <li>Марка и модель автомобиля</li>
                <li>Размеры, если есть</li>
                <li>Описание задачи</li>
                <li>Образец детали, если сохранился</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что важно учитывать</h2>
              <p className="mt-4 text-base leading-7 text-body">
                Не каждая деталь подходит для FDM-печати. Каждый запрос оценивается индивидуально: важны геометрия, нагрузка, температура, способ крепления и требования к внешнему виду.
              </p>
              <div className="mt-6">
                <Button href="#custom-form" variant="secondary">Перейти к форме</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Примеры задач" title="Какие запросы можно приносить" />
          <FeatureCards
            items={[
              { title: "Нужно повторить сломанную деталь", description: "Если есть образец или хотя бы его часть, шансы на восстановление заметно выше." },
              { title: "Нужен редкий пластиковый элемент", description: "Подходит для деталей, которые трудно найти в продаже или на разборках." },
              { title: "Нужен небольшой повторяемый тираж", description: "Если надо несколько одинаковых изделий, производство можно организовать серией." }
            ]}
          />
        </Container>
      </section>

      <section id="custom-form" className="py-16 sm:py-20">
        <Container>
          <RequestForm
            source="custom-page-form"
            title="Заявка на изготовление под заказ"
            description="Форма пока работает в mock-режиме, но структура уже подготовлена для дальнейшего подключения реальной отправки."
          />
        </Container>
      </section>

      <CTASection
        title="Если задача нестандартная, лучше показать её заранее"
        description="Фото, размеры или образец детали помогут быстрее понять, можно ли изготовить изделие и какой путь будет оптимальным."
        actions={<ServiceHeroActions source="custom-final" anchorId="custom-form" />}
      />
    </>
  );
}

