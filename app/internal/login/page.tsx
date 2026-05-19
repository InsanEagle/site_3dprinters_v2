import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getInternalAccessConfig, hasInternalAccess } from "@/lib/internal-access";
import { loginToInternalBackoffice } from "./actions";

export default async function InternalLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string; retryAfter?: string }>;
}) {
  const config = getInternalAccessConfig();

  if (!config.enabled) {
    if (config.isMisconfigured) {
      return (
        <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl items-center px-4 py-12 sm:px-6">
          <section className="w-full rounded-[32px] border border-rose-200 bg-white p-8 shadow-card sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Internal only</p>
            <h1 className="mt-4 text-3xl font-semibold text-ink">Backoffice временно недоступен</h1>
            <p className="mt-4 text-base leading-7 text-body">
              В production внутренний доступ включается только при явной настройке обязательных env. Сейчас отсутствуют{" "}
              <span className="font-medium text-ink">{config.missing.join(", ")}</span>.
            </p>
            <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
              Добавьте обязательные значения в production environment и перезапустите приложение. Dev fallback для этих параметров в production отключен намеренно.
            </div>
            <Link href="/" className="mt-6 inline-flex text-sm font-medium text-accent transition hover:text-accent-hover">
              Вернуться на сайт
            </Link>
          </section>
        </main>
      );
    }

    notFound();
  }

  if (await hasInternalAccess()) {
    redirect("/internal/orders");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const nextPath =
    typeof resolvedSearchParams.next === "string" && resolvedSearchParams.next.startsWith("/internal")
      ? resolvedSearchParams.next
      : "/internal/orders";
  const retryAfterSeconds =
    typeof resolvedSearchParams.retryAfter === "string" ? Number.parseInt(resolvedSearchParams.retryAfter, 10) : 0;
  const retryAfterMinutes = retryAfterSeconds > 0 ? Math.max(1, Math.ceil(retryAfterSeconds / 60)) : 0;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-[32px] border border-line bg-white p-8 shadow-card sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Internal only</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">Вход в backoffice заказов</h1>
        <p className="mt-4 text-base leading-7 text-body">
          Это временный внутренний доступ по паролю из env. Он нужен, чтобы менеджер мог работать с заказами без ручного редактирования JSON-файлов.
        </p>

        <form action={loginToInternalBackoffice} data-testid="internal-login-form" className="mt-8 space-y-5">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block text-sm font-medium text-ink" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            data-testid="internal-login-password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
          />
          {resolvedSearchParams.error === "invalid" ? (
            <p data-testid="internal-login-error" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
              Пароль не подошел. Проверьте `INTERNAL_BACKOFFICE_PASSWORD` и попробуйте снова.
            </p>
          ) : null}
          {resolvedSearchParams.error === "cooldown" ? (
            <p data-testid="internal-login-error" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Слишком много неудачных попыток входа. Подождите
              {retryAfterMinutes ? ` около ${retryAfterMinutes} мин.` : " немного"} и попробуйте снова.
            </p>
          ) : null}
          <Button type="submit" className="w-full" data-testid="internal-login-submit">
            Открыть список заказов
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
          <p>Ограничение текущего этапа: это не полноценная auth-система, а простой internal gate на cookie-сессии с ограничением времени жизни и базовым cooldown после серии неудачных попыток.</p>
        </div>

        <Link href="/" className="mt-6 inline-flex text-sm font-medium text-accent transition hover:text-accent-hover">
          Вернуться на сайт
        </Link>
      </section>
    </main>
  );
}
