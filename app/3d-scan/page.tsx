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

export const metadata: Metadata = {
  title: "3D-сканирование | AutoParts FDM",
  description: "Страница услуги 3D-сканирования автомобильных деталей для восстановления, доработки и последующего производства."
};

export default function ScanPage() {
  return (
    <>
      <HeroSection
        title="3D-сканирование автомобильных деталей"
        description="Оцифровываем детали сложной формы для последующего восстановления, доработки и производства."
        actions={<ServiceHeroActions source="scan" anchorId="scan-form" />}
        aside={
          <div className="rounded-[32px] border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Когда нужен 3D-скан</p>
            <div className="mt-5 grid gap-3">
              {["Сложная форма детали", "Редкая или снятая с производства деталь", "Нужна доработка или повторение"].map((item) => (
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
          <SectionTitle eyebrow="Что дает 3D-сканирование" title="Цифровая основа для восстановления и производства" />
          <FeatureCards
            items={[
              { title: "Цифровую основу для работы", description: "Это отправная точка для анализа формы, доработки и повторного изготовления." },
              { title: "Возможность восстановления", description: "Особенно полезно для редких деталей, которых больше нет в продаже." },
              { title: "Возможность доработки модели", description: "После оцифровки можно внести корректировки под конкретную задачу." },
              { title: "Подготовку к производству", description: "После обработки модель можно использовать в дальнейшем производственном цикле." }
            ]}
          />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Процесс" title="Как проходит процесс" />
          <Timeline
            steps={[
              "Вы присылаете фото, описание или саму деталь",
              "Мы оцениваем, подходит ли задача для 3D-сканирования",
              "Выполняем сканирование, чистим и подготавливаем цифровую основу",
              "Используем результат для восстановления, доработки или производства"
            ]}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Для каких задач подходит</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                <li>Сложные пластиковые детали с выраженной геометрией</li>
                <li>Редкие и снятые с производства элементы</li>
                <li>Повторение существующей детали с последующей доработкой</li>
                <li>Подготовка основы для изготовления единичного изделия или небольшой серии</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Что желательно подготовить</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                <li>Фото детали с нескольких ракурсов</li>
                <li>Марка и модель автомобиля</li>
                <li>Описание задачи: восстановление, повторение или доработка</li>
                <li>Образец детали, если он сохранился</li>
              </ul>
              <p className="mt-6 text-base leading-7 text-body">
                Важно учитывать, что не каждая деталь требует именно 3D-сканирования. Иногда быстрее и практичнее идти другим путем, поэтому оценка всегда индивидуальная.
              </p>
              <div className="mt-6">
                <Button href="#scan-form" variant="secondary">Перейти к форме</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Примеры задач" title="Что можно решать через 3D-сканирование" />
          <FeatureCards
            items={[
              { title: "Восстановление сложной детали", description: "Когда важно быстро получить цифровую основу для дальнейшей работы." },
              { title: "Оцифровка редкого элемента", description: "Когда деталь нужно повторить или адаптировать под новый проект." },
              { title: "Подготовка к малой серии", description: "Когда после сканирования и доработки нужна повторяемость изделий." }
            ]}
          />
        </Container>
      </section>

      <section id="scan-form" className="py-16 sm:py-20">
        <Container>
          <RequestForm
            source="scan-page-form"
            title="Заявка на 3D-сканирование"
            description="Форма готова для приема заявок. Позже сюда можно подключить API, CRM или отправку в почту / мессенджер."
          />
        </Container>
      </section>

      <CTASection
        title="Если деталь сложная по форме, лучше начать со сканирования"
        description="Так проще оценить реальную геометрию, подготовить цифровую основу и выбрать корректный путь дальнейшего изготовления."
        actions={<ServiceHeroActions source="scan-final" anchorId="scan-form" />}
      />
    </>
  );
}
