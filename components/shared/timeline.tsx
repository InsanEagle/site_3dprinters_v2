export function Timeline({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step} className="rounded-3xl border border-line bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Шаг {index + 1}</p>
          <p className="mt-4 text-lg leading-8 text-ink">{step}</p>
        </div>
      ))}
    </div>
  );
}

