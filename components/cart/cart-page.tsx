"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

function formatAmount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function CartPageContent() {
  const { canCheckout, clearCart, deliverySummary, invalidItemCount, isHydrated, items, removeItem, setQuantity, subtotal, subtotalCount } = useCart();

  if (!isHydrated) {
    return (
      <section className="rounded-[32px] border border-line bg-white p-8">
        <p className="text-base leading-7 text-body">Загружаем корзину…</p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="rounded-[32px] border border-line bg-white p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Корзина пуста</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Пока в корзине нет товаров</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Добавляйте сюда direct-sale позиции с фиксированной ценой. Marketplace и inquiry-сценарии по-прежнему остаются вне корзины.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/catalog">Перейти в каталог</Button>
          <Button href="/contacts" variant="secondary">
            Задать вопрос
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4">
        <div className="rounded-[32px] border border-line bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Корзина</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Товары, выбранные для прямой покупки</h1>
          <p className="mt-4 text-base leading-7 text-body">
            Корзина хранится локально в браузере и пересчитывается по актуальным данным каталога после каждой загрузки страницы.
          </p>
        </div>

        {items.map((item) => (
          <article key={item.slug} className="rounded-[32px] border border-line bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="overflow-hidden rounded-2xl border border-line bg-surface sm:w-40">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-end bg-[linear-gradient(135deg,_#f6f7f8_0%,_#eceff3_100%)] p-4">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-body">
                      Без фото
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-body">{item.sku ?? "Каталожная позиция"}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-ink">{item.name}</h2>
                    {item.href ? (
                      <Link href={item.href} className="mt-3 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover">
                        Открыть страницу товара
                      </Link>
                    ) : null}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-body">Цена</p>
                    <p className="mt-1 text-lg font-semibold text-ink">{item.priceLabel ?? "Цена уточняется"}</p>
                    <p className="mt-2 text-sm text-body">
                      {item.canPurchase && typeof item.lineTotal === "number" ? `${formatAmount(item.lineTotal)} ₽` : "Не входит в subtotal"}
                    </p>
                  </div>
                </div>

                <p className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${item.canPurchase ? "border border-line bg-surface text-body" : "border border-amber-200 bg-amber-50 text-amber-900"}`}>
                  {item.statusMessage}
                </p>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-body">Количество</span>
                    <div className="flex items-center rounded-xl border border-line bg-surface">
                      <button
                        type="button"
                        className="px-4 py-2 text-lg font-semibold text-ink transition hover:bg-white"
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        aria-label={`Уменьшить количество ${item.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-12 px-3 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-4 py-2 text-lg font-semibold text-ink transition hover:bg-white"
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        aria-label={`Увеличить количество ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-sm font-semibold text-body underline-offset-4 transition hover:text-ink hover:underline"
                    onClick={() => removeItem(item.slug)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-[32px] border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-28">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Итого</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <span className="text-base text-body">Subtotal</span>
          <span className="text-3xl font-semibold text-ink">{formatAmount(subtotal)} ₽</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-body">
          В subtotal сейчас входят только позиции, которые можно честно купить на сайте без дополнительного уточнения: {subtotalCount}.
        </p>
        <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-body">
          <p>{deliverySummary.summary}</p>
          {deliverySummary.manualReviewNote ? <p className="mt-2">{deliverySummary.manualReviewNote}</p> : null}
        </div>
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${canCheckout ? "border border-line bg-surface text-body" : "border border-amber-200 bg-amber-50 text-amber-900"}`}>
          {canCheckout
            ? "Checkout уже доступен: можно перейти к короткому оформлению без регистрации."
            : invalidItemCount > 0
              ? `Checkout пока заблокирован, потому что в корзине есть невалидные для прямой покупки позиции: ${invalidItemCount}.`
              : "Checkout пока заблокирован, потому что для текущего набора товаров нужен ручной выбор способа получения вне onsite flow."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {canCheckout ? (
            <Button href="/checkout">Перейти к checkout</Button>
          ) : (
            <Button href="/catalog">Продолжить выбор</Button>
          )}
          <Button href="/contacts" variant="secondary">
            Уточнить детали заказа
          </Button>
          <Button variant="ghost" onClick={clearCart}>
            Очистить корзину
          </Button>
        </div>
      </aside>
    </div>
  );
}
