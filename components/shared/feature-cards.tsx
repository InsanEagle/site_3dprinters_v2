const iconTypes = ["sample", "print", "model", "series"] as const;

type FeatureIconType = (typeof iconTypes)[number];

function FeatureIcon({ type }: { type: FeatureIconType }) {
  return (
    <div
      className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface text-body"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {type === "sample" ? (
          <>
            <path d="M15 8h.01" />
            <path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" />
            <path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" />
            <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
          </>
        ) : null}

        {type === "print" ? (
          <>
            <path d="M6 17.6l-2 -1.1v-2.5" />
            <path d="M4 10v-2.5l2 -1.1" />
            <path d="M10 4.1l2 -1.1l2 1.1" />
            <path d="M18 6.4l2 1.1v2.5" />
            <path d="M20 14v2.5l-2 1.12" />
            <path d="M14 19.9l-2 1.1l-2 -1.1" />
            <path d="M12 12l2 -1.1" />
            <path d="M18 8.6l2 -1.1" />
            <path d="M12 12v2.5" />
            <path d="M12 18.5v2.5" />
            <path d="M12 12l-2 -1.12" />
            <path d="M6 8.6l-2 -1.1" />
          </>
        ) : null}

        {type === "model" ? (
          <>
            <path d="M3 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2" />
            <path d="M17 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2" />
            <path d="M10 7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2" />
            <path d="M10 8.5a6 6 0 0 0 -5 5.5" />
            <path d="M14 8.5a6 6 0 0 1 5 5.5" />
            <path d="M10 8h-6" />
            <path d="M20 8h-6" />
            <path d="M2 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M20 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </>
        ) : null}

        {type === "series" ? (
          <>
            <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
            <path d="M4 12l8 4l8 -4" />
            <path d="M4 16l8 4l8 -4" />
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
