"use client";

import { Button } from "@/components/ui/button";
import { homeContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafeExternalHref } from "@/lib/content";
import { useRequestModal } from "@/components/shared/request-modal";

export function HomeActions({ compact = false, cta = false }: { compact?: boolean; cta?: boolean }) {
  const { openModal } = useRequestModal();
  const telegramHref = getSafeExternalHref(siteConfig.telegram);
  const whatsappHref = getSafeExternalHref(siteConfig.whatsapp);

  if (compact) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => openModal({ title: homeContent.heroPrimaryCta, source: "home:missing-part" })}>{homeContent.heroPrimaryCta}</Button>
        {telegramHref ? <Button href={telegramHref} variant="secondary">Написать в Telegram</Button> : null}
        {whatsappHref ? <Button href={whatsappHref} variant="secondary">Написать в WhatsApp</Button> : null}
      </div>
    );
  }

  if (cta) {
    return (
      <>
        <Button href="/catalog" variant="primary">{homeContent.heroSecondaryCta}</Button>
        <Button onClick={() => openModal({ title: homeContent.heroPrimaryCta, source: "home:final-cta" })} variant="secondary">
          {homeContent.heroPrimaryCta}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button href="/catalog">{homeContent.heroSecondaryCta}</Button>
      <Button onClick={() => openModal({ title: homeContent.heroPrimaryCta, source: "home:hero" })} variant="secondary">
        {homeContent.heroPrimaryCta}
      </Button>
    </>
  );
}
