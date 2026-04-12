import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";
import { deliveryContent } from "@/data/content";

export const metadata: Metadata = {
  title: "Передача готовых изделий | Изготовление деталей",
  description: deliveryContent.text
};

export default function DeliveryPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionTitle eyebrow="Передача готовых изделий" title={deliveryContent.title} description={deliveryContent.text} />
        <div className="grid gap-6 lg:grid-cols-3">
          {deliveryContent.points.map((item) => (
            <section key={item} className="rounded-3xl border border-line bg-white p-8">
              <p className="text-base leading-7 text-body">{item}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-[32px] border border-line bg-surface p-8">
          <h2 className="text-3xl font-semibold text-ink">Если есть уточнения по передаче заказа</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">
            Особенности упаковки, передачи, сроков и дополнительных требований лучше указать сразу в заявке вместе с описанием задачи.
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
