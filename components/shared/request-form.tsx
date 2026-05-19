"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDefaultRequestFormText } from "@/lib/request-ui";
import {
  formatRequestFileSize,
  REQUEST_UPLOAD_ACCEPT,
  REQUEST_UPLOAD_MAX_FILES,
  RequestFieldErrors,
  RequestSubmissionPayload,
  RequestSubmissionResponse,
  requestValidationMessages,
  validateRequestFiles,
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
  hints?: string[];
  detailsPrefill?: string;
  submitLabel?: string;
  footerNote?: string;
  chrome?: "page" | "embedded";
};

type RequestFormValues = Omit<RequestSubmissionPayload, "source" | "attachments">;
type RequestErrorCode = Extract<RequestSubmissionResponse, { ok: false }>["code"];

type FormStatus =
  | { type: "idle" }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string; code?: RequestErrorCode };

const emptyErrors: RequestFieldErrors = {};
const defaultCopy = getDefaultRequestFormText();

export function RequestForm({
  source,
  title = defaultCopy.title,
  description = defaultCopy.description,
  productName,
  compact = false,
  titleId,
  onSuccess,
  hints = defaultCopy.hints,
  detailsPrefill,
  submitLabel = defaultCopy.submitLabel,
  footerNote = defaultCopy.footerNote,
  chrome = "page"
}: RequestFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<RequestFormValues>({
    name: "",
    contact: "",
    brand: "",
    model: "",
    details: detailsPrefill ?? (productName ? `Интересует позиция: ${productName}.` : ""),
    productName
  });
  const [files, setFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<RequestFieldErrors>(emptyErrors);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const isSubmitting = status.type === "loading";
  const formClassName =
    chrome === "embedded"
      ? "rounded-none border-0 bg-transparent p-0"
      : "rounded-3xl border border-line bg-white p-6 sm:p-8";
  const fileSummary = useMemo(
    () => (files.length ? `${files.length} из ${REQUEST_UPLOAD_MAX_FILES} файлов выбрано` : requestValidationMessages.fileHint),
    [files.length]
  );

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function clearFileError() {
    if (fieldErrors.file) {
      setFieldErrors((current) => ({ ...current, file: undefined }));
    }
  }

  function setFileValidationError(message: string) {
    setFieldErrors((current) => ({ ...current, file: message }));
    setStatus({ type: "error", message });
  }

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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    const fileMessage = validateRequestFiles(nextFiles);

    if (fileMessage) {
      setFiles([]);
      resetFileInput();
      setFileValidationError(fileMessage);
      return;
    }

    setFiles(nextFiles);
    clearFileError();

    if (status.type !== "idle") {
      setStatus({ type: "idle" });
    }
  }

  function removeFile(index: number) {
    const nextFiles = files.filter((_, currentIndex) => currentIndex !== index);
    setFiles(nextFiles);
    clearFileError();

    if (!nextFiles.length) {
      resetFileInput();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRequestSubmission({
      source,
      ...values
    });
    const fileMessage = validateRequestFiles(files);

    if (fileMessage) {
      validation.fieldErrors.file = fileMessage;
    }

    if (!validation.data || fileMessage) {
      setFieldErrors(validation.fieldErrors);
      setStatus({
        type: "error",
        message: fileMessage ?? "Проверьте обязательные поля формы и попробуйте снова."
      });
      return;
    }

    setFieldErrors(emptyErrors);
    setStatus({
      type: "loading",
      message: files.length ? "Загружаем фото и отправляем заявку..." : "Отправляем данные формы..."
    });

    try {
      const formData = new FormData();
      formData.set("source", validation.data.source);
      formData.set("name", validation.data.name);
      formData.set("contact", validation.data.contact);
      formData.set("brand", validation.data.brand ?? "");
      formData.set("model", validation.data.model ?? "");
      formData.set("details", validation.data.details);
      formData.set("productName", validation.data.productName ?? "");

      for (const file of files) {
        formData.append("files", file);
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        body: formData
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
    <form onSubmit={handleSubmit} noValidate data-testid={`request-form-${source}`} className={formClassName}>
      <div className="mb-6">
        <h3 id={titleId} className="text-2xl font-semibold text-ink">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-body">{description}</p>
        {hints?.length ? (
          <div className="mt-4 grid gap-2 text-sm text-body">
            {hints.map((hint) => (
              <p key={hint}>• {hint}</p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Имя
          <input
            required
            name="name"
            data-testid="request-name"
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
            data-testid="request-contact"
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
            data-testid="request-brand"
            value={values.brand ?? ""}
            onChange={handleChange}
            className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Модель автомобиля
          <input
            name="model"
            data-testid="request-model"
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
            data-testid="request-details"
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

        <div className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span>Фотографии детали</span>
            <span className="text-xs font-normal text-body">{fileSummary}</span>
          </div>
          <label className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-line bg-surface px-4 py-4 text-sm text-body transition hover:border-accent hover:bg-white">
            <span className="font-medium text-ink">Прикрепить фото</span>
            <span>Поддерживаются JPG, PNG и WEBP. Можно выбрать несколько изображений сразу.</span>
            <input
              ref={fileInputRef}
              type="file"
              name="files"
              data-testid="request-files"
              accept={REQUEST_UPLOAD_ACCEPT}
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <span className="text-xs leading-6 text-body">{requestValidationMessages.fileHint}</span>
          {fieldErrors.file ? (
            <span id="request-file-error" className="text-xs leading-6 text-red-600">
              {fieldErrors.file}
            </span>
          ) : null}
          {files.length ? (
            <div className="grid gap-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-body">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{file.name}</p>
                    <p>{formatRequestFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface"
                    onClick={() => removeFile(index)}
                  >
                    Убрать
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {status.type === "error" ? (
          <div data-testid="request-error" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
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
          <div data-testid="request-success" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
            {status.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-body">{footerNote}</p>
          <Button type="submit" disabled={isSubmitting} data-testid="request-submit">
            {isSubmitting ? (files.length ? "Загружаем и отправляем..." : "Отправляем...") : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
