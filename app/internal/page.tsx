import { notFound, redirect } from "next/navigation";
import { getInternalAccessConfig, hasInternalAccess } from "@/lib/internal-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
