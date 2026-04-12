"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formContent } from "@/data/content";
import {
  RequestFieldErrors,
  RequestSubmissionPayload,
  RequestSubmissionResponse,
  requestValidationMessages,
  validateRequestSubmission
} from "@/lib/request-submission";

type RequestFormProps = {
  source: string;
  title?: string;
  description?: string;
  productName?: string;
  compact?: boolean;
  titleId?: string;
  onSuccess?: () => void;
};

type RequestFormValues = Omit<RequestSubmissionPayload, "source">;
type RequestErrorCode = Extract<RequestSubmissionResponse, { ok: false }>["code"];

type FormStatus =
  | { type: "idle" }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string; code?: RequestErrorCode };

const emptyErrors: RequestFieldErrors = {};

export function RequestForm({
  source,
  title = formContent.titleDefault,
  description = formContent.introDefault,
  productName,
  compact = false,
  titleId,
  onSuccess
}: RequestFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RequestFormValues>({
    name: "",
    contact: "",
    brand: "",
    model: "",
    details: productName ? `Интересует позиция: ${productName}.` : "",
    productName
  });
  const [fieldErrors, setFieldErrors] = useState<RequestFieldErrors>(emptyErrors);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const isSubmitting = status.type === "loading";

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name as keyof RequestFieldErrors]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (status.type !== "idle") {
      setStatus({ type: "idle" });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRequestSubmission({
      source,
      ...values
    });

    if (!validation.data) {
      setFieldErrors(validation.fieldErrors);
      setStatus({
        type: "error",
        message: "Проверьте обязательные поля формы и попробуйте снова."
      });
      return;
    }

    setFieldErrors(emptyErrors);
    setStatus({
      type: "loading",
      message: "Отправляем данные формы..."
    });

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(validation.data)
      });

      const result = (await response.json()) as RequestSubmissionResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.ok ? emptyErrors : result.fieldErrors ?? emptyErrors);
        setStatus({
          type: "error",
          message: result.message,
          code: result.ok ? undefined : result.code
        });
        return;
      }

      setStatus({
        type: "success",
        message: result.message
      });

      onSuccess?.();
      router.push(result.redirectTo ?? `/thanks?source=${encodeURIComponent(source)}`);
    } catch {
      setStatus({
        type: "error",
        message: requestValidationMessages.serverError
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h3 id={titleId} className="text-2xl font-semibold text-ink">{title}</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-body">{description}</p>
        <div className="mt-4 grid gap-2 text-sm text-body">
          {formContent.fieldsHints.map((hint) => (
            <p key={hint}>• {hint}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Имя
          <input
            required
            name="name"
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "request-name-error" : undefined}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
          {fieldErrors.name ? (
            <span id="request-name-error" className="text-xs leading-6 text-red-600">
              {fieldErrors.name}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Телефон, email или мессенджер
          <input
            required
            name="contact"
            value={values.contact}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.contact)}
            aria-describedby={fieldErrors.contact ? "request-contact-error" : undefined}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
          {fieldErrors.contact ? (
            <span id="request-contact-error" className="text-xs leading-6 text-red-600">
              {fieldErrors.contact}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Марка автомобиля
          <input
            name="brand"
            value={values.brand ?? ""}
            onChange={handleChange}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Модель автомобиля
          <input
            name="model"
            value={values.model ?? ""}
            onChange={handleChange}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Краткое описание задачи
          <textarea
            required
            name="details"
            rows={compact ? 4 : 5}
            value={values.details}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.details)}
            aria-describedby={fieldErrors.details ? "request-details-error" : undefined}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
          {fieldErrors.details ? (
            <span id="request-details-error" className="text-xs leading-6 text-red-600">
              {fieldErrors.details}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Фотографии и файлы
          <input
            type="file"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-sm text-body opacity-70"
          />
          <span className="text-xs leading-6 text-body">{requestValidationMessages.fileUnavailable}</span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {status.type === "error" ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            <p>{status.message}</p>
            {status.code === "submission_unavailable" || status.code === "delivery_failed" || status.code === "server_error" ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Button href="/contacts" variant="secondary" className="px-4 py-2.5">
                  Открыть контакты
                </Button>
                <Button href="/catalog" variant="ghost" className="px-4 py-2.5">
                  Вернуться в каталог
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {status.type === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
            {status.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-body">
            Заявка считается отправленной только после успешного ответа сервера.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправляем..." : "Отправить заявку"}
          </Button>
        </div>
      </div>
    </form>
  );
}
