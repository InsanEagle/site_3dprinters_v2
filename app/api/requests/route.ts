import { NextResponse } from "next/server";
import {
  RequestSubmissionResponse,
  requestValidationMessages,
  submitRequestSubmission,
  validateRequestSubmission
} from "@/lib/request-submission";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
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

  try {
    const result = await submitRequestSubmission(validation.data);

    if (!result.ok) {
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

    return NextResponse.json<RequestSubmissionResponse>(result, { status: 201 });
  } catch {
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
