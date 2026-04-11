"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type RequestFormProps = {
  source: string;
  title?: string;
  description?: string;
  productName?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function RequestForm({
  source,
  title = "Оставить заявку",
  description = "Оставьте контакт и кратко опишите задачу. Пока форма работает в mock-режиме и ведет на страницу благодарности.",
  productName,
  compact = false,
  onSuccess
}: RequestFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSuccess?.();
    router.push(`/thanks?source=${encodeURIComponent(source)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-ink">{title}</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-body">{description}</p>
      </div>
      <input type="hidden" name="source" value={source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Имя
          <input required name="name" className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Телефон или мессенджер
          <input required name="contact" className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Марка автомобиля
          <input name="brand" defaultValue={productName ? "TODO: уточнить" : ""} className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Модель автомобиля
          <input name="model" className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Краткое описание задачи
          <textarea
            name="details"
            rows={compact ? 4 : 5}
            defaultValue={productName ? `Интересует товар: ${productName}` : ""}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Прикрепить фото
          <input type="file" name="file" className="rounded-xl border border-dashed border-line px-4 py-3 text-sm text-body" />
          <span className="text-xs leading-6 text-body">TODO: при подключении backend обработать загрузку файла и реальное хранение.</span>
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-body">Отправляя форму, пользователь ожидает обратную связь. TODO: добавить реальные условия обработки заявки.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправляем..." : "Отправить заявку"}
        </Button>
      </div>
    </form>
  );
}

