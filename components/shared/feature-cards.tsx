const iconTypes = ["sample", "print", "model", "series"] as const;

type FeatureIconType = (typeof iconTypes)[number];

function FeatureIcon({ type }: { type: FeatureIconType }) {
  return (
    <div
      className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface text-body"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 44 44"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      >
        {type === "sample" ? (
          <>
            <path d="M14 15.5h9.5l6.5 6.5v8.5H14z" />
            <path d="M23.5 15.5V22H30" className="stroke-accent" />
            <path d="M17.5 26h9" />
            <path d="M11 12h5M11 12v5M33 32h-5M33 32v-5" className="stroke-accent" />
          </>
        ) : null}

        {type === "print" ? (
          <>
            <path d="M14 18.5 22 14l8 4.5-8 4.5z" />
            <path d="M14 18.5v8.5l8 4.5 8-4.5v-8.5" />
            <path d="M22 23v8.5" />
            <path d="M16 34h12" className="stroke-accent" />
            <path d="M18 37h8" />
          </>
        ) : null}

        {type === "model" ? (
          <>
            <path d="M14 29.5 20.5 17l9.5 9.5-12.5 6.5z" />
            <path d="m20.5 17 3-3 9.5 9.5-3 3" className="stroke-accent" />
            <path d="M17.5 25.5h5" />
            <circle cx="14" cy="29.5" r="1.8" />
            <circle cx="20.5" cy="17" r="1.8" />
            <circle cx="30" cy="26.5" r="1.8" />
          </>
        ) : null}

        {type === "series" ? (
          <>
            <path d="M15 18.5 22 15l7 3.5-7 3.5z" />
            <path d="m15 24 7 3.5 7-3.5" />
            <path d="m15 29.5 7 3.5 7-3.5" />
            <path d="M15 18.5v4M29 18.5v4" />
            <path d="M33 16v5h-5M11 28v-5h5" className="stroke-accent" />
          </>
        ) : null}
      </svg>
    </div>
  );
}

export function FeatureCards({
  items
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item, index) => (
        <article key={item.title} className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <FeatureIcon type={iconTypes[index % iconTypes.length]} />
          <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
          <p className="mt-3 text-base leading-7 text-body">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
