import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getInternalAccessConfig, hasInternalAccess } from "@/lib/internal-access";
import { logoutFromInternalBackoffice } from "../login/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InternalProtectedLayout({ children }: { children: React.ReactNode }) {
  const config = getInternalAccessConfig();

  if (!config.enabled) {
    notFound();
  }

  if (!(await hasInternalAccess())) {
    redirect("/internal/login?next=/internal/orders");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Internal only</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Backoffice</h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Минимальная внутренняя панель поверх файлового хранилища заявок и заказов.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/internal/orders" variant="secondary">
            Заказы
          </Button>
          <Button href="/internal/requests" variant="secondary">
            Заявки
          </Button>
          <form action={logoutFromInternalBackoffice}>
            <Button type="submit" variant="ghost" data-testid="internal-logout-submit">
              Выйти
            </Button>
          </form>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-body transition hover:text-ink">
            На сайт
          </Link>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </main>
  );
}
