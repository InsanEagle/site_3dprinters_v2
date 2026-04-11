export function ProductSpecs({
  items
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="grid gap-3 rounded-3xl border border-line bg-white p-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 border-b border-line pb-3 last:border-none last:pb-0 sm:flex-row sm:justify-between">
          <dt className="text-sm font-medium text-body">{item.label}</dt>
          <dd className="text-sm font-semibold text-ink sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
