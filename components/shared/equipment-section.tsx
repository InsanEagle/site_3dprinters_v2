import { equipment } from "@/data/site";

export function EquipmentSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {equipment.map((item) => (
        <article key={item.title} className="rounded-3xl border border-line bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">{item.title}</p>
          <h3 className="mt-4 text-xl font-semibold text-ink">{item.quantity}</h3>
          <p className="mt-4 text-base leading-7 text-body">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

