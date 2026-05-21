"use client";

import { Button } from "@/components/ui/button";
import { homeContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getSafeExternalHref } from "@/lib/content";
import { getDefaultRequestFormText } from "@/lib/request-ui";
import { useRequestModal } from "@/components/shared/request-modal";

export function HomeActions({ compact = false, cta = false }: { compact?: boolean; cta?: boolean }) {
  const { openModal } = useRequestModal();
  const telegramHref = getSafeExternalHref(siteConfig.telegram);
  const whatsappHref = getSafeExternalHref(siteConfig.whatsapp);
  const requestCopy = getDefaultRequestFormText();

  if (compact) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => openModal({ ...requestCopy, title: homeContent.heroPrimaryCta, source: "home:missing-part" })}>
          {homeContent.heroPrimaryCta}
        </Button>
        {telegramHref ? <Button href={telegramHref} variant="secondary">Написать в Telegram</Button> : null}
        {whatsappHref ? <Button href={whatsappHref} variant="secondary">Написать в WhatsApp</Button> : null}
      </div>
    );
  }

  if (cta) {
    return (
      <>
        <Button href="/catalog" variant="primary">{homeContent.heroSecondaryCta}</Button>
        <Button onClick={() => openModal({ ...requestCopy, title: homeContent.heroPrimaryCta, source: "home:final-cta" })} variant="secondary">
          {homeContent.heroPrimaryCta}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => openModal({ ...requestCopy, title: homeContent.heroPrimaryCta, source: "home:hero" })}>
        {homeContent.heroPrimaryCta}
      </Button>
      <Button href="/catalog" variant="secondary">{homeContent.heroSecondaryCta}</Button>
    </>
  );
}
