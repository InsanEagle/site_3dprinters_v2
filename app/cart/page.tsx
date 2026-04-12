import { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Корзина | Изготовление деталей",
  description: "Корзина для direct-sale позиций с фиксированной ценой."
};

export default function CartPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <CartPageContent />
      </Container>
    </div>
  );
}
