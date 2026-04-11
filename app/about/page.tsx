import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CTASection } from "@/components/shared/cta-section";
import { EquipmentSection } from "@/components/shared/equipment-section";
import { FeatureCards } from "@/components/shared/feature-cards";
import { SectionTitle } from "@/components/shared/section-title";

export const metadata: Metadata = {
  title: "О компании | AutoParts FDM",
  description: "О компании, производственных мощностях, оборудовании и подходе к изготовлению автомобильных деталей."
};

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="О компании"
            title="Не просто печатаем модели, а решаем задачи по автомобильным деталям"
            description="Сайт подчеркивает главное: вы работаете не как абстрактная 3D-печать, а как техническое производство с фокусом на автомобильные детали, восстановление и нестандартные задачи."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border border-line bg-surface p-8">
              <h2 className="text-2xl font-semibold text-ink">Основные направления работы</h2>
              <div className="mt-5 grid gap-3">
                {["Готовые детали для авто", "Изготовление под заказ", "3D-сканирование и восстановление"].map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-4 text-base font-medium text-ink">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-line bg-white p-8">
              <h2 className="text-2xl font-semibold text-ink">Почему это удобно клиенту</h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-body">
                <li>Понятный процесс работы и несколько сценариев обращения</li>
                <li>Готовность работать с нестандартными задачами</li>
                <li>Возможность изготовления небольших серий</li>
                <li>Собственное оборудование и реальное производство</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle
            eyebrow="Оборудование"
            title="Производственные возможности"
            description="Блок построен не как сухой список характеристик, а как объяснение, почему у компании есть запас по производству, гибкость по типам задач и возможность работать как с единичными изделиями, так и с небольшими партиями."
          />
          <EquipmentSection />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Производство" title="Галерея производства" description="Пока здесь placeholders. Когда появятся реальные фото оборудования, рабочих зон и изделий, блок станет одним из самых сильных элементов доверия." />
          <div className="grid gap-6 md:grid-cols-3">
            {["TODO: фото парка принтеров", "TODO: фото процесса 3D-сканирования", "TODO: фото готовых деталей и упаковки"].map((item) => (
              <div key={item} className="flex min-h-[280px] items-end rounded-3xl border border-dashed border-line bg-surface p-5">
                <p className="text-sm text-body">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16 sm:py-20">
        <Container>
          <SectionTitle eyebrow="Подход" title="Почему такой сайт работает на доверие" />
          <FeatureCards
            items={[
              { title: "Спокойная подача", description: "Без кричащего маркетинга и без выдуманных обещаний, только понятные сценарии и честные ограничения." },
              { title: "Технический визуальный стиль", description: "Чистая сетка, много воздуха, акцент на структуру и реальные производственные процессы." },
              { title: "Подготовка к росту", description: "Архитектура сразу готова для добавления новых категорий, товаров, кейсов и реальных фото." }
            ]}
          />
        </Container>
      </section>

      <CTASection
        title="Если хотите обсудить задачу до заказа, начнем с заявки"
        description="Подходит и для вопроса по готовой детали, и для нестандартного запроса на изготовление или сканирование."
        actions={<Button href="/contacts">Перейти в контакты</Button>}
      />
    </>
  );
}

