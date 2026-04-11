export function FeatureCards({
  items
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="mb-5 h-11 w-11 rounded-2xl bg-surface" />
          <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
          <p className="mt-3 text-base leading-7 text-body">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

