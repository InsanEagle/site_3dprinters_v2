"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { useRequestModal } from "@/components/shared/request-modal";

export function HomeActions({ compact = false, cta = false }: { compact?: boolean; cta?: boolean }) {
  const { openModal } = useRequestModal();

  if (compact) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => openModal({ title: "Заявка на изготовление детали", source: "home:missing-part" })}>Отправить заявку</Button>
        <Button href={siteConfig.telegram} variant="secondary">Написать в Telegram</Button>
        <Button href={siteConfig.whatsapp} variant="secondary">Написать в WhatsApp</Button>
      </div>
    );
  }

  if (cta) {
    return (
      <>
        <Button href="/catalog" variant="primary">Смотреть каталог</Button>
        <Button onClick={() => openModal({ title: "Оставить заявку", source: "home:final-cta" })} variant="secondary">
          Оставить заявку
        </Button>
      </>
    );
  }

  return (
    <>
      <Button href="/catalog">Перейти в каталог</Button>
      <Button onClick={() => openModal({ title: "Оставить заявку", source: "home:hero" })} variant="secondary">
        Оставить заявку
      </Button>
    </>
  );
}

