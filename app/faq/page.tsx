import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/shared/container";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { SectionTitle } from "@/components/shared/section-title";
import { faqContent } from "@/data/content";
import { createFaqPageJsonLd } from "@/lib/seo-jsonld";

export const metadata: Metadata = {
  title: "FAQ | Изготовление деталей",
  description: "Ответы на частые вопросы по изготовлению деталей, 3D-печати, моделированию и подаче заявки."
};

export default function FaqPage() {
  return (
    <div className="bg-surface py-16 sm:py-20">
      <JsonLd data={createFaqPageJsonLd()} />
      <Container>
        <SectionTitle
          eyebrow="FAQ"
          title="Частые вопросы"
          description="Если вы только оцениваете задачу и не уверены, с чего начать, этот блок поможет быстрее понять формат обращения."
        />
        <FAQAccordion items={faqContent} />
      </Container>
    </div>
  );
}
