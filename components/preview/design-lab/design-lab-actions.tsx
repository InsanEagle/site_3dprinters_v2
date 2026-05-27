"use client";

import Link from "next/link";
import { getDefaultRequestFormText } from "@/lib/request-ui";
import { cn } from "@/lib/utils";
import { useRequestModal } from "@/components/shared/request-modal";

type DesignLabActionsProps = {
  source: string;
  compact?: boolean;
};

const requestCopy = getDefaultRequestFormText();

export function DesignLabActions({ source, compact = false }: DesignLabActionsProps) {
  const { openModal } = useRequestModal();

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", compact ? "sm:items-center" : "")}>
      <button
        type="button"
        onClick={() =>
          openModal({
            ...requestCopy,
            title: "Оставить заявку на изготовление",
            source,
          })
        }
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-accent bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 active:translate-y-px"
      >
        Оставить заявку
      </button>
      <Link
        href="#design-lab-examples"
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 active:translate-y-px"
      >
        Смотреть примеры
      </Link>
    </div>
  );
}
