import { NextResponse } from "next/server";
import { buildCartSummary } from "@/lib/cart";
import { resolveDeliverySelection } from "@/lib/delivery";
import {
  OrderLineItemInput,
  OrderSubmissionResponse,
  orderValidationMessages,
  validateOrderSubmission
} from "@/lib/order-submission";
import {
  createOrderRecord,
  markOrderNotificationDelivered,
  markOrderNotificationFailed,
  submitOrderSubmission
} from "@/lib/order-processing";
import { saveOrderRecord } from "@/lib/orders-store";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: "Не удалось прочитать данные checkout. Попробуйте заполнить форму заново."
      },
      { status: 400 }
    );
  }

  const validation = validateOrderSubmission(payload);

  if (!validation.data) {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: "Проверьте обязательные поля checkout и попробуйте снова.",
        fieldErrors: validation.fieldErrors
      },
      { status: 400 }
    );
  }

  const cartSummary = buildCartSummary(validation.data.items);

  if (!cartSummary.items.length) {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: orderValidationMessages.itemsRequired,
        fieldErrors: {
          ...validation.fieldErrors,
          items: orderValidationMessages.itemsRequired
        }
      },
      { status: 400 }
    );
  }

  if (!cartSummary.canCheckout) {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "checkout_unavailable",
        message: orderValidationMessages.checkoutUnavailable,
        fieldErrors: {
          ...validation.fieldErrors,
          items: orderValidationMessages.checkoutUnavailable
        }
      },
      { status: 409 }
    );
  }

  const orderItems: OrderLineItemInput[] = cartSummary.purchasableItems.map((item) => ({
    productSlug: item.slug,
    sku: item.sku,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice as number,
    lineTotal: item.lineTotal as number
  }));
  const deliverySelection = resolveDeliverySelection(
    cartSummary.purchasableItems
      .map((item) => item.product)
      .filter((product): product is NonNullable<(typeof cartSummary.purchasableItems)[number]["product"]> => Boolean(product)),
    validation.data.customer.deliveryMethod
  );

  if (!deliverySelection) {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "validation_error",
        message: orderValidationMessages.deliveryMethodUnavailable,
        fieldErrors: {
          ...validation.fieldErrors,
          deliveryMethod: orderValidationMessages.deliveryMethodUnavailable
        }
      },
      { status: 409 }
    );
  }

  const orderRecord = createOrderRecord({
    source: validation.data.source,
    customer: validation.data.customer,
    delivery: {
      method: deliverySelection.selectedMethod,
      label: deliverySelection.deliveryLabel,
      note: deliverySelection.deliveryNote,
      fee: deliverySelection.deliveryFee,
      commercialNote: deliverySelection.commercialNote,
      fulfillmentNote: deliverySelection.fulfillmentNote
    },
    items: orderItems,
    subtotal: cartSummary.subtotal
  });

  try {
    await saveOrderRecord(orderRecord);

    const result = await submitOrderSubmission(orderRecord);
    const nextRecord = result.ok
      ? markOrderNotificationDelivered(orderRecord)
      : markOrderNotificationFailed(orderRecord, result.message);

    await saveOrderRecord(nextRecord);

    if (!result.ok) {
      const status =
        result.code === "validation_error"
          ? 400
          : result.code === "submission_unavailable"
            ? 503
            : result.code === "delivery_failed"
              ? 502
              : 500;

      return NextResponse.json<OrderSubmissionResponse>(result, { status });
    }

    return NextResponse.json<OrderSubmissionResponse>(result, { status: 201 });
  } catch {
    return NextResponse.json<OrderSubmissionResponse>(
      {
        ok: false,
        code: "server_error",
        message: orderValidationMessages.serverError
      },
      { status: 500 }
    );
  }
}
