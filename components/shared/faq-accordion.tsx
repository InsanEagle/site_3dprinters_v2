"use client";

import { useState } from "react";
import { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div key={item.question} className="rounded-2xl border border-line bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              <span className="text-base font-semibold text-ink sm:text-lg">{item.question}</span>
              <span className={cn("text-xl text-accent transition", open && "rotate-45")}>+</span>
            </button>
            {open ? <div className="px-5 pb-5 text-base leading-7 text-body">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

