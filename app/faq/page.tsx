import { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { SectionTitle } from "@/components/shared/section-title";
import { faqItems } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQ | AutoParts FDM",
  description: "Ответы на частые вопросы по каталогу, изготовлению под заказ, 3D-сканированию, срокам и доставке."
};

export default function FaqPage() {
  return (
    <div className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="FAQ"
          title="Частые вопросы"
          description="Отдельная страница для вопросов, которые помогут пользователю быстрее понять, подходит ли ему готовая деталь, изготовление под заказ или 3D-сканирование."
        />
        <FAQAccordion items={faqItems} />
      </Container>
    </div>
  );
}

