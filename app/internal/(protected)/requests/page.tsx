import Link from "next/link";
import { listRequestRecords } from "@/lib/requests-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short"
});

function formatRequestDate(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

function getRequestPreview(value: string) {
  return value.length > 140 ? `${value.slice(0, 137)}...` : value;
}

export default async function InternalRequestsPage() {
  const records = await listRequestRecords();

  return (
    <div className="space-y-6" data-testid="internal-requests-page">
      <section className="rounded-[32px] border border-line bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Заявки</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Inbox заявок с сайта</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-body">
              Здесь отображаются заявки, которые были успешно доставлены в primary webhook и сохранены во внутреннем файловом store.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface px-4 py-3">
            <p className="text-sm text-body">Всего заявок</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{records.length}</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-line bg-white">
        <div className="hidden grid-cols-[0.8fr_1fr_0.8fr_1.5fr_0.5fr] gap-4 border-b border-line bg-surface px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-body lg:grid">
          <span>Дата</span>
          <span>Клиент</span>
          <span>Источник</span>
          <span>Описание</span>
          <span>Файлы</span>
        </div>

        {records.length ? (
          records.map((record) => (
            <Link
              key={record.id}
              href={`/internal/requests/${record.id}`}
              data-testid={`internal-request-row-${record.id}`}
              className="grid grid-cols-1 gap-4 border-b border-line px-6 py-5 transition last:border-b-0 hover:bg-surface/70 lg:grid-cols-[0.8fr_1fr_0.8fr_1.5fr_0.5fr]"
            >
              <div>
                <p className="text-sm font-medium text-ink">{formatRequestDate(record.createdAt)}</p>
                <p className="mt-1 text-xs text-body">{record.id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{record.name}</p>
                <p className="mt-1 text-sm text-body">{record.contact}</p>
              </div>
              <p className="text-sm text-body">{record.source}</p>
              <p className="text-sm leading-6 text-body">{getRequestPreview(record.details)}</p>
              <p className="text-sm font-medium text-ink">{record.attachments.length ? `${record.attachments.length} шт.` : "Нет"}</p>
            </Link>
          ))
        ) : (
          <div className="px-6 py-12 text-sm leading-6 text-body">
            Пока нет сохраненных заявок. После успешной отправки формы и доставки primary webhook здесь появится первая запись.
          </div>
        )}
      </section>
    </div>
  );
}
