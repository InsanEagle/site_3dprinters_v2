import { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description ? <p className="mt-4 text-base leading-7 text-body sm:text-lg">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

