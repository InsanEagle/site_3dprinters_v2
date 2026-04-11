import Link from "next/link";
import { Category } from "@/types";

export function CategoryGrid({ items }: { items: Category[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <Link
          key={item.slug}
          href={`/catalog/${item.slug}`}
          className="group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <div className="mb-6 flex h-40 items-end rounded-2xl bg-[linear-gradient(135deg,_#f6f7f8_0%,_#e5e7eb_100%)] p-4">
            <span className="text-sm font-medium text-body">Категория {String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="text-xl font-semibold text-ink group-hover:text-accent">{item.title}</h3>
          <p className="mt-3 text-base leading-7 text-body">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}

