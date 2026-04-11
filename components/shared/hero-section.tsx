import { ReactNode } from "react";
import { Container } from "@/components/shared/container";

export function HeroSection({
  title,
  description,
  actions,
  aside,
  badges
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  badges?: string[];
}) {
  return (
    <section className="border-b border-line bg-[radial-gradient(circle_at_top_left,_rgba(232,106,45,0.08),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f6f7f8_100%)] py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-body sm:text-xl">{description}</p>
            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            {badges?.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  );
}

