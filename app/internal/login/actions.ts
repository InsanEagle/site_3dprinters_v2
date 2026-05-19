"use server";

import { notFound, redirect } from "next/navigation";
import {
  clearInternalLoginGuard,
  closeInternalSession,
  getInternalAccessConfig,
  getInternalLoginGuardState,
  openInternalSession,
  registerFailedInternalLogin,
  verifyInternalPassword
} from "@/lib/internal-access";

function resolveNextPath(value: FormDataEntryValue | null) {
  const nextPath = typeof value === "string" ? value : "";

  if (!nextPath.startsWith("/internal")) {
    return "/internal/orders";
  }

  return nextPath;
}

export async function loginToInternalBackoffice(formData: FormData) {
  const config = getInternalAccessConfig();

  if (!config.enabled) {
    notFound();
  }

  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const nextPath = resolveNextPath(formData.get("next"));
  const guardState = await getInternalLoginGuardState();

  if (guardState.blocked) {
    redirect(
      `/internal/login?error=cooldown&next=${encodeURIComponent(nextPath)}&retryAfter=${encodeURIComponent(String(guardState.remainingCooldownSeconds))}`
    );
  }

  if (!verifyInternalPassword(password)) {
    const nextGuardState = await registerFailedInternalLogin();
    const errorCode = nextGuardState.blocked ? "cooldown" : "invalid";
    const retryAfter = nextGuardState.blocked ? `&retryAfter=${encodeURIComponent(String(nextGuardState.remainingCooldownSeconds))}` : "";

    redirect(`/internal/login?error=${errorCode}&next=${encodeURIComponent(nextPath)}${retryAfter}`);
  }

  await clearInternalLoginGuard();
  await openInternalSession();
  redirect(nextPath);
}

export async function logoutFromInternalBackoffice() {
  await clearInternalLoginGuard();
  await closeInternalSession();
  redirect("/internal/login");
}
