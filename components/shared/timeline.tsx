type TimelineStep = {
  step?: string;
  title: string;
  text: string;
};

export function Timeline({ steps }: { steps: Array<string | TimelineStep> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) =>
        typeof step === "string" ? (
          <div key={step} className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Шаг {index + 1}</p>
            <p className="mt-4 text-lg leading-8 text-ink">{step}</p>
          </div>
        ) : (
          <div key={`${step.step ?? index}-${step.title}`} className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">{step.step ?? `Шаг ${index + 1}`}</p>
            <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-3 text-base leading-7 text-body">{step.text}</p>
          </div>
        )
      )}
    </div>
  );
}
