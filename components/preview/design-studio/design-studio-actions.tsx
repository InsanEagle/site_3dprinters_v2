"use client";

import { useRequestModal } from "@/components/shared/request-modal";
import { getDefaultRequestFormText } from "@/lib/request-ui";

type DesignStudioActionsProps = {
  source: string;
  tone: "garage" | "atelier" | "atlas";
  className?: string;
};

const requestCopy = getDefaultRequestFormText();

const toneClassName: Record<DesignStudioActionsProps["tone"], string> = {
  garage:
    "border-[#E86A2D] bg-[#E86A2D] text-white hover:border-[#CF5B22] hover:bg-[#CF5B22] focus-visible:ring-[#E86A2D]/35",
  atelier:
    "border-[#262A2E] bg-[#262A2E] text-white hover:border-[#0F1113] hover:bg-[#0F1113] focus-visible:ring-[#262A2E]/35",
  atlas:
    "border-[#234B43] bg-[#234B43] text-white hover:border-[#183730] hover:bg-[#183730] focus-visible:ring-[#234B43]/35"
};

export function DesignStudioRequestButton({ source, tone, className = "" }: DesignStudioActionsProps) {
  const { openModal } = useRequestModal();

  return (
    <button
      type="button"
      onClick={() =>
        openModal({
          ...requestCopy,
          title: "Оставить заявку на изготовление",
          source
        })
      }
      className={[
        "inline-flex min-h-12 shrink-0 items-center justify-center rounded-none border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px",
        toneClassName[tone],
        className
      ].join(" ")}
    >
      Оставить заявку
    </button>
  );
}
