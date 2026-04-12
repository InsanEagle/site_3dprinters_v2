"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRequestModal } from "@/components/shared/request-modal";
import { getPhotoRequestFormText } from "@/lib/request-ui";

type ServiceHeroActionsProps = {
  source: string;
  anchorId: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryCopy?: {
    title: string;
    description: string;
    hints?: string[];
    detailsPrefill?: string;
    submitLabel?: string;
    footerNote?: string;
  };
  noteText?: string;
  noteLinkHref?: string;
  noteLinkLabel?: string;
};

export function ServiceHeroActions({
  source,
  anchorId,
  primaryLabel = "Открыть форму заявки",
  secondaryLabel = "Обсудить по фото",
  secondaryCopy,
  noteText,
  noteLinkHref,
  noteLinkLabel
}: ServiceHeroActionsProps) {
  const { openModal } = useRequestModal();
  const photoCopy = secondaryCopy ?? getPhotoRequestFormText();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={`#${anchorId}`}>{primaryLabel}</Button>
        <Button onClick={() => openModal({ ...photoCopy, source: `${source}:photo` })} variant="secondary">
          {secondaryLabel}
        </Button>
      </div>
      {noteText ? (
        <div className="mt-3 text-sm leading-6 text-body">
          {noteText}{" "}
          {noteLinkHref && noteLinkLabel ? <Link href={noteLinkHref} className="font-medium text-accent">{noteLinkLabel}</Link> : null}
        </div>
      ) : null}
    </div>
  );
}
