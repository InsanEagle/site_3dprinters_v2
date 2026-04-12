import { StatePanel } from "@/components/shared/state-panel";

export default function Loading() {
  return (
    <div className="py-24">
      <StatePanel
        eyebrow="Загрузка"
        title="Открываем страницу"
        description="Подготавливаем контент и структуру страницы. Это обычно занимает всего несколько секунд."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
        </div>
      </StatePanel>
    </div>
  );
}
