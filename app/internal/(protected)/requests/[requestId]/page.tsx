import Link from "next/link";
import { notFound } from "next/navigation";
import { findRequestRecord } from "@/lib/requests-store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short"
});

function formatRequestDate(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} МБ`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

export default async function InternalRequestDetailsPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const record = await findRequestRecord(requestId);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-6" data-testid="internal-request-details">
      <Link href="/internal/requests" className="inline-flex text-sm font-medium text-accent transition hover:text-accent-hover">
        К списку заявок
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[32px] border border-line bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Заявка</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{record.name}</h2>
          <p className="mt-3 text-sm leading-6 text-body">
            Создана {formatRequestDate(record.createdAt)} • источник: {record.source}
          </p>

          <dl className="mt-8 grid gap-5 text-sm leading-6">
            <div>
              <dt className="font-medium text-ink">Контакт</dt>
              <dd className="text-body">{record.contact}</dd>
            </div>
            {record.productName ? (
              <div>
                <dt className="font-medium text-ink">Товар / позиция</dt>
                <dd className="text-body">{record.productName}</dd>
              </div>
            ) : null}
            {record.brand || record.model ? (
              <div>
                <dt className="font-medium text-ink">Автомобиль</dt>
                <dd className="text-body">{[record.brand, record.model].filter(Boolean).join(" ")}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-ink">Описание задачи</dt>
              <dd className="whitespace-pre-wrap text-body">{record.details}</dd>
            </div>
          </dl>
        </article>

        <div className="space-y-6">
          <article className="rounded-[32px] border border-line bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Webhook delivery</h2>
            <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                  record.managerNotification.status === "delivered"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                )}
              >
                {record.managerNotification.status === "delivered" ? "Доставлено" : "Ошибка доставки"}
              </span>
              <p className="mt-3">Канал: {record.managerNotification.channel}</p>
              <p>Доставлено: {record.managerNotification.deliveredAt ? formatRequestDate(record.managerNotification.deliveredAt) : "Нет данных"}</p>
            </div>

            {record.managerNotification.channels?.length ? (
              <ul className="mt-4 space-y-2 text-sm leading-6">
                {record.managerNotification.channels.map((channel) => (
                  <li key={channel.name} className="rounded-2xl border border-line bg-surface px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-ink">{channel.label}</span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", channel.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
                        {channel.ok ? "OK" : "Ошибка"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-body">
                      {channel.required ? "Основной канал" : "Дополнительный канал"} • HTTP {channel.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>

          <article className="rounded-[32px] border border-line bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Вложения</h2>
            {record.attachments.length ? (
              <ul className="mt-4 space-y-3">
                {record.attachments.map((attachment) => (
                  <li key={attachment.storageKey} className="rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6">
                    <p className="font-medium text-ink">{attachment.fileName}</p>
                    <p className="text-body">
                      {attachment.contentType} • {formatFileSize(attachment.size)}
                    </p>
                    <a href={attachment.relativeUrl} className="mt-2 inline-flex font-medium text-accent transition hover:text-accent-hover">
                      Открыть вложение
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-body">К этой заявке не прикрепляли файлы.</p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
