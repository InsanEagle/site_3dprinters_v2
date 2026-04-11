"use client";

import { Button } from "@/components/ui/button";
import { useRequestModal } from "@/components/shared/request-modal";

export function ServiceHeroActions({ source, anchorId }: { source: string; anchorId: string }) {
  const { openModal } = useRequestModal();

  return (
    <>
      <Button href={`#${anchorId}`}>Оставить заявку</Button>
      <Button onClick={() => openModal({ title: "Отправить фото детали", source: `${source}:photo` })} variant="secondary">
        Отправить фото детали
      </Button>
    </>
  );
}
