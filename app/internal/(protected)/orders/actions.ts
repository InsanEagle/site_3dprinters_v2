"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasInternalAccess } from "@/lib/internal-access";
import { deliverSavedOrder } from "@/lib/order-processing";
import { isOrderStatus } from "@/lib/order-submission";
import { findOrderRecord, saveOrderRecord, updateOrderStatus } from "@/lib/orders-store";

export async function updateOrderStatusAction(formData: FormData) {
  if (!(await hasInternalAccess())) {
    redirect("/internal/login?next=/internal/orders");
  }

  const orderId = typeof formData.get("orderId") === "string" ? String(formData.get("orderId")) : "";
  const status = typeof formData.get("status") === "string" ? String(formData.get("status")) : "";

  if (!orderId || !isOrderStatus(status)) {
    redirect(`/internal/orders/${encodeURIComponent(orderId)}?error=invalid-status`);
  }

  const record = await findOrderRecord(orderId);

  if (!record) {
    redirect("/internal/orders?error=not-found");
  }

  await updateOrderStatus(orderId, status);
  revalidatePath("/internal/orders");
  revalidatePath(`/internal/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/internal/orders/${orderId}?updated=1`);
}

export async function retryOrderDeliveryAction(formData: FormData) {
  if (!(await hasInternalAccess())) {
    redirect("/internal/login?next=/internal/orders");
  }

  const orderId = typeof formData.get("orderId") === "string" ? String(formData.get("orderId")) : "";

  if (!orderId) {
    redirect("/internal/orders?error=not-found");
  }

  const record = await findOrderRecord(orderId);

  if (!record) {
    redirect("/internal/orders?error=not-found");
  }

  const deliveryResult = await deliverSavedOrder(record, "retry");
  await saveOrderRecord(deliveryResult.record);
  revalidatePath("/internal/orders");
  revalidatePath(`/internal/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
  redirect(`/internal/orders/${orderId}?deliveryRetried=1`);
}
