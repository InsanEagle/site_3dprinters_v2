import { NextResponse } from "next/server";
import { removeSavedRequestAttachments, saveRequestAttachments } from "@/lib/request-attachments";
import {
  RequestSubmissionPayload,
  RequestSubmissionResponse,
  getRequestSubmissionAvailability,
  requestValidationMessages,
  submitRequestSubmission,
  validateRequestFiles,
  validateRequestSubmission
} from "@/lib/request-submission";
import { createRequestRecord, saveRequestRecord } from "@/lib/requests-store";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function toPublicRequestSubmissionResponse(result: RequestSubmissionResponse): RequestSubmissionResponse {
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    message: result.message,
    redirectTo: result.redirectTo
  };
}

async function saveDeliveredRequestRecord(input: {
  requestId?: string;
  createdAt?: string;
  payload: RequestSubmissionPayload;
  channels?: Awaited<ReturnType<typeof submitRequestSubmission>>["channels"];
}) {
  if (!input.requestId || !input.createdAt) {
    return;
  }

  const record = createRequestRecord({
    requestId: input.requestId,
    createdAt: input.createdAt,
    payload: input.payload,
    deliveryStatus: "delivered",
    channels: input.channels
  });

  try {
    await saveRequestRecord(record);
  } catch {
    console.warn("[api/requests] Request was delivered, but internal request inbox record could not be saved.");
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let payload: unknown;
  let uploadedFiles: File[] = [];

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      uploadedFiles = getFiles(formData, "files");

      payload = {
        source: getStringValue(formData, "source"),
        name: getStringValue(formData, "name"),
        contact: getStringValue(formData, "contact"),
        brand: getStringValue(formData, "brand"),
        model: getStringValue(formData, "model"),
        details: getStringValue(formData, "details"),
        productName: getStringValue(formData, "productName")
      };
    } else {
      payload = await request.json();
    }
  } catch {
    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: "Не удалось прочитать данные формы. Попробуйте заполнить поля заново."
      },
      { status: 400 }
    );
  }

  const validation = validateRequestSubmission(payload);
  const fileValidationMessage = validateRequestFiles(uploadedFiles);

  if (fileValidationMessage) {
    validation.fieldErrors.file = fileValidationMessage;
  }

  if (!validation.data) {
    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: "Форма заполнена не полностью. Проверьте обязательные поля и попробуйте снова.",
        fieldErrors: validation.fieldErrors
      },
      { status: 400 }
    );
  }

  if (fileValidationMessage) {
    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: fileValidationMessage,
        fieldErrors: validation.fieldErrors
      },
      { status: 400 }
    );
  }

  const availability = getRequestSubmissionAvailability();

  if (!availability.isConfigured) {
    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "submission_unavailable",
        message: requestValidationMessages.formUnavailable
      },
      { status: 503 }
    );
  }

  let savedAttachments = [] as Awaited<ReturnType<typeof saveRequestAttachments>>;

  try {
    if (uploadedFiles.length) {
      savedAttachments = await saveRequestAttachments(uploadedFiles, request.url);
    }
  } catch {
    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "server_error",
        message: requestValidationMessages.fileSaveError,
        fieldErrors: {
          ...validation.fieldErrors,
          file: requestValidationMessages.fileSaveError
        }
      },
      { status: 500 }
    );
  }

  try {
    const requestPayload = {
      ...validation.data,
      attachments: savedAttachments.length ? savedAttachments : undefined
    };
    const result = await submitRequestSubmission(requestPayload);

    if (!result.ok) {
      await removeSavedRequestAttachments(savedAttachments);

      const status =
        result.code === "validation_error"
          ? 400
          : result.code === "submission_unavailable"
            ? 503
            : result.code === "delivery_failed"
              ? 502
              : 500;

      return NextResponse.json<RequestSubmissionResponse>(result, { status });
    }

    await saveDeliveredRequestRecord({
      requestId: result.requestId,
      createdAt: result.createdAt,
      payload: requestPayload,
      channels: result.channels
    });

    return NextResponse.json<RequestSubmissionResponse>(toPublicRequestSubmissionResponse(result), { status: 201 });
  } catch {
    await removeSavedRequestAttachments(savedAttachments);

    return NextResponse.json<RequestSubmissionResponse>(
      {
        ok: false,
        code: "server_error",
        message: requestValidationMessages.serverError
      },
      { status: 500 }
    );
  }
}
