import { ReactNode } from "react";
import { Container } from "@/components/shared/container";

export function CTASection({
  title,
  description,
  actions
}: {
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-[32px] bg-ink px-6 py-10 text-white sm:px-10">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
        </div>
      </Container>
    </section>
  );
}

