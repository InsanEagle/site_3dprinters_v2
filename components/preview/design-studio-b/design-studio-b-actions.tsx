"use client";

import { useRequestModal } from "@/components/shared/request-modal";
import { getDefaultRequestFormText } from "@/lib/request-ui";

type AtelierRequestButtonProps = {
  source: string;
  variant?: "primary" | "dark";
  className?: string;
};

const requestCopy = getDefaultRequestFormText();

const variantClassName: Record<NonNullable<AtelierRequestButtonProps["variant"]>, string> = {
  primary:
    "border-[#E86A2D] bg-[#E86A2D] text-white hover:border-[#CF5B22] hover:bg-[#CF5B22] focus-visible:ring-[#E86A2D]/35",
  dark:
    "border-[#202428] bg-[#202428] text-white hover:border-[#111315] hover:bg-[#111315] focus-visible:ring-[#202428]/35",
};

export function AtelierRequestButton({ source, variant = "primary", className = "" }: AtelierRequestButtonProps) {
  const { openModal } = useRequestModal();

  return (
    <button
      type="button"
      onClick={() =>
        openModal({
          ...requestCopy,
          title: "Оставить заявку на изготовление",
          description:
            "Опишите деталь, приложите фото, размеры, образец или 3D-модель. После заявки задачу можно уточнить перед изготовлением.",
          source,
        })
      }
      className={[
        "inline-flex min-h-12 shrink-0 items-center justify-center rounded-[6px] border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px",
        variantClassName[variant],
        className,
      ].join(" ")}
    >
      Оставить заявку
    </button>
  );
}
