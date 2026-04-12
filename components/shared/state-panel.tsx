import { ReactNode } from "react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

type StatePanelProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
};

export function StatePanel({
  title,
  description,
  eyebrow,
  actions,
  children,
  compact = false,
  className
}: StatePanelProps) {
  return (
    <Container className={className}>
      <div className={cn("rounded-[32px] border border-line bg-surface", compact ? "p-8" : "p-10 sm:p-12")}>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</p> : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-body sm:text-lg">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
        {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
      </div>
    </Container>
  );
}
