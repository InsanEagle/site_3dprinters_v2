import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Спасибо за заявку | AutoParts FDM",
  description: "Страница благодарности после отправки формы."
};

export default async function ThanksPage({
  searchParams
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;

  return (
    <div className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-line bg-surface p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Заявка отправлена</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Спасибо, мы получили обращение</h1>
          <p className="mt-4 text-base leading-7 text-body sm:text-lg">
            В MVP это mock-отправка, но пользовательский сценарий уже готов. Позже здесь можно показать реальное подтверждение, номер заявки или дальнейшие шаги.
          </p>
          {source ? <p className="mt-4 text-sm text-body">Источник заявки: {source}</p> : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/">На главную</Button>
            <Button href="/catalog" variant="secondary">Смотреть каталог</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

