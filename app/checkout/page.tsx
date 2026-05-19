import { Metadata } from "next";
import { CheckoutPageContent } from "@/components/cart/checkout-page";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Checkout | Изготовление деталей",
  description: "Короткий checkout только для ограниченного direct-sale ассортимента. Основной публичный поток сайта остается inquiry-first."
};

export default function CheckoutPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <CheckoutPageContent />
      </Container>
    </div>
  );
}
