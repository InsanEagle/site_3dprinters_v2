import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";

export const metadata: Metadata = {
  title: "Доставка и оплата | AutoParts FDM",
  description: "Базовая страница про оплату, сроки изготовления и доставку с нейтральными текстами и TODO для реальных условий."
};

export default function DeliveryPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="Доставка и оплата"
          title="Базовые условия заказа"
          description="На этой странице оставлены безопасные нейтральные формулировки. Конкретные юридические условия, сроки и способы оплаты стоит подставить после согласования внутри компании."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Способы оплаты</h2>
            <p className="mt-4 text-base leading-7 text-body">
              TODO: указать реальные способы оплаты. Для MVP оставлена нейтральная структура, в которую можно подставить оплату переводом, по счету или другой подходящий вариант.
            </p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Сроки изготовления</h2>
            <p className="mt-4 text-base leading-7 text-body">
              Сроки зависят от сложности детали, необходимости 3D-сканирования, постобработки и объема партии. TODO: добавить реальные диапазоны сроков.
            </p>
          </section>
          <section className="rounded-3xl border border-line bg-white p-8">
            <h2 className="text-2xl font-semibold text-ink">Доставка</h2>
            <p className="mt-4 text-base leading-7 text-body">
              TODO: указать реальные службы доставки, географию отправки и условия упаковки. Сейчас это безопасный placeholder без выдуманных обещаний.
            </p>
          </section>
        </div>
        <div className="mt-10 rounded-[32px] border border-line bg-surface p-8">
          <h2 className="text-3xl font-semibold text-ink">Вопросы по заказу</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">
            Если нужно уточнить сроки, оплату или формат отправки, лучше оставить заявку через форму или связаться через контакты.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/contacts">Перейти в контакты</Button>
            <Button href="/catalog" variant="secondary">Смотреть каталог</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

