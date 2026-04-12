import { Metadata } from "next";
import { CheckoutPageContent } from "@/components/cart/checkout-page";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Checkout | Изготовление деталей",
  description: "Короткий checkout для direct-sale товаров с фиксированной ценой."
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
