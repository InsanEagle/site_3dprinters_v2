import { notFound, redirect } from "next/navigation";
import { getInternalAccessConfig, hasInternalAccess } from "@/lib/internal-access";

export default async function InternalIndexPage() {
  const config = getInternalAccessConfig();

  if (!config.enabled) {
    notFound();
  }

  if (await hasInternalAccess()) {
    redirect("/internal/orders");
  }

  redirect("/internal/login");
}
