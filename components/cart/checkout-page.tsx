"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { DeliveryMethodOption } from "@/lib/delivery";
import { OrderDeliveryMethod, OrderFieldErrors, OrderSubmissionResponse, orderValidationMessages } from "@/lib/order-submission";

type CheckoutValues = {
  name: string;
  contact: string;
  city: string;
  address: string;
  deliveryMethod: OrderDeliveryMethod;
  comment: string;
};

type CheckoutStatus =
  | { type: "idle" }
  | { type: "loading"; message: string }
  | { type: "error"; message: string; code?: Extract<OrderSubmissionResponse, { ok: false }>["code"] }
  | { type: "success"; message: string };

const emptyErrors: OrderFieldErrors = {};

function formatAmount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function getMethodDescription(option: DeliveryMethodOption) {
  return `${option.description} ${option.note}`;
}

export function CheckoutPageContent() {
  const router = useRouter();
  const { canCheckout, clearCart, deliverySummary, invalidItemCount, isHydrated, items, subtotal } = useCart();
  const defaultMethod = deliverySummary.options[0]?.method ?? "delivery";
  const [values, setValues] = useState<CheckoutValues>({
    name: "",
    contact: "",
    city: "",
    address: "",
    deliveryMethod: defaultMethod,
    comment: ""
  });
  const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>(emptyErrors);
  const [status, setStatus] = useState<CheckoutStatus>({ type: "idle" });

  const isSubmitting = status.type === "loading";
  const checkoutItems = useMemo(() => items.filter((item) => item.canPurchase), [items]);
  const selectedDeliveryOption = deliverySummary.options.find((option) => option.method === values.deliveryMethod);

  useEffect(() => {
    if (!deliverySummary.options.length) {
      return;
    }

    if (!deliverySummary.options.some((option) => option.method === values.deliveryMethod)) {
      setValues((current) => ({
        ...current,
        deliveryMethod: deliverySummary.options[0].method,
        address: deliverySummary.options[0].requiresAddress ? current.address : ""
      }));
    }
  }, [deliverySummary.options, values.deliveryMethod]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name as keyof OrderFieldErrors]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (status.type !== "idle") {
      setStatus({ type: "idle" });
    }
  }

  function handleDeliveryMethodChange(method: OrderDeliveryMethod) {
    setValues((current) => ({
      ...current,
      deliveryMethod: method,
      address: method === "pickup" ? "" : current.address
    }));

    if (fieldErrors.deliveryMethod || fieldErrors.address) {
      setFieldErrors((current) => ({
        ...current,
        deliveryMethod: undefined,
        address: undefined
      }));
    }

    if (status.type !== "idle") {
      setStatus({ type: "idle" });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCheckout || !checkoutItems.length) {
      setStatus({
        type: "error",
        message: orderValidationMessages.checkoutUnavailable,
        code: "checkout_unavailable"
      });
      return;
    }

    setFieldErrors(emptyErrors);
    setStatus({
      type: "loading",
      message: "Проверяем корзину и отправляем заказ..."
    });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: "checkout-page",
          items: checkoutItems.map((item) => ({
            slug: item.slug,
            quantity: item.quantity
          })),
          customer: {
            name: values.name,
            contact: values.contact,
            city: values.city,
            address: values.deliveryMethod === "delivery" ? values.address : "",
            deliveryMethod: values.deliveryMethod,
            comment: values.comment
          }
        })
      });

      const result = (await response.json()) as OrderSubmissionResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.ok ? emptyErrors : result.fieldErrors ?? emptyErrors);
        setStatus({
          type: "error",
          message: result.message,
          code: result.ok ? undefined : result.code
        });
        return;
      }

      setStatus({
        type: "success",
        message: result.message
      });
      clearCart();
      router.push(result.redirectTo ?? "/thanks?source=checkout-page&kind=order");
    } catch {
      setStatus({
        type: "error",
        message: orderValidationMessages.serverError
      });
    }
  }

  if (!isHydrated) {
    return (
      <section className="rounded-[32px] border border-line bg-white p-8">
        <p className="text-base leading-7 text-body">Загружаем checkout…</p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="rounded-[32px] border border-line bg-white p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Checkout недоступен</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">В корзине пока нет товаров для оформления</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Сначала добавьте direct-sale позиции с фиксированной ценой. Marketplace и inquiry товары по-прежнему оформляются вне onsite checkout.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/catalog">Перейти в каталог</Button>
          <Button href="/cart" variant="secondary">
            Открыть корзину
          </Button>
        </div>
      </section>
    );
  }

  if (!canCheckout) {
    return (
      <section className="rounded-[32px] border border-line bg-white p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Checkout требует проверки</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Часть корзины больше нельзя оформить напрямую</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          {invalidItemCount > 0
            ? `Корзина пересчиталась по актуальному каталогу. Сейчас есть невалидные позиции: ${invalidItemCount}. Удалите их или вернитесь к карточкам товаров, чтобы продолжить оформление честно.`
            : `${deliverySummary.summary} ${deliverySummary.manualReviewNote ?? "Для этого набора товаров onsite checkout временно не обещает неподтвержденный способ получения."}`}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/cart">Вернуться в корзину</Button>
          <Button href="/catalog" variant="secondary">
            Открыть каталог
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={handleSubmit} noValidate className="rounded-[32px] border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Checkout</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Короткое оформление без регистрации</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          После отправки мы фиксируем состав заказа и связываемся для подтверждения доставки, сроков и следующего шага. Автоматический расчет доставки пока не обещаем.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Имя
            <input
              required
              name="name"
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.name)}
              className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
            />
            {fieldErrors.name ? <span className="text-xs leading-6 text-red-600">{fieldErrors.name}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            Телефон, email или мессенджер
            <input
              required
              name="contact"
              value={values.contact}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.contact)}
              className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
            />
            {fieldErrors.contact ? <span className="text-xs leading-6 text-red-600">{fieldErrors.contact}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            Город
            <input
              required
              name="city"
              value={values.city}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.city)}
              className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
            />
            {fieldErrors.city ? <span className="text-xs leading-6 text-red-600">{fieldErrors.city}</span> : null}
          </label>

          <div className="grid gap-2 text-sm font-medium text-ink">
            <span>Способ получения</span>
            <div className="grid gap-2">
              {deliverySummary.options.map((option) => (
                <label key={option.method} className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-body">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={option.method}
                    checked={values.deliveryMethod === option.method}
                    onChange={() => handleDeliveryMethodChange(option.method)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-semibold text-ink">{option.label}</span>
                    <span className="block">{getMethodDescription(option)}</span>
                  </span>
                </label>
              ))}
            </div>
            {fieldErrors.deliveryMethod ? (
              <span className="text-xs leading-6 text-red-600">{fieldErrors.deliveryMethod}</span>
            ) : null}
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            {selectedDeliveryOption?.requiresAddress ? "Адрес доставки" : "Адрес или ориентир при необходимости"}
            <input
              name="address"
              required={selectedDeliveryOption?.requiresAddress}
              value={values.address}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.address)}
              className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
              placeholder={
                selectedDeliveryOption?.requiresAddress
                  ? "Улица, дом, помещение или другой понятный ориентир"
                  : "Можно оставить пустым, если детали уточним отдельно"
              }
            />
            {fieldErrors.address ? <span className="text-xs leading-6 text-red-600">{fieldErrors.address}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Комментарий к заказу
            <textarea
              name="comment"
              rows={4}
              value={values.comment}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.comment)}
              className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Например: нужен звонок перед отправкой, важны сроки, нужен другой вариант получения."
            />
            {fieldErrors.comment ? <span className="text-xs leading-6 text-red-600">{fieldErrors.comment}</span> : null}
          </label>
        </div>

        <div className="mt-8 rounded-[28px] border border-line bg-surface p-5">
          <h2 className="text-xl font-semibold text-ink">Summary перед отправкой</h2>
          <p className="mt-2 text-sm leading-6 text-body">
            Состав заказа берется из актуальной корзины. Если каталог изменится и позиция перестанет подходить для direct-sale checkout, сервер это остановит.
          </p>
          <div className="mt-4 grid gap-3">
            {checkoutItems.map((item) => (
              <div key={item.slug} className="flex items-start justify-between gap-4 rounded-2xl border border-white bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-body">
                    {item.sku ?? "Каталожная позиция"} • {item.quantity} шт.
                  </p>
                  {item.href ? (
                    <Link href={item.href} className="mt-2 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover">
                      Открыть товар
                    </Link>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-sm text-body">{item.priceLabel}</p>
                  <p className="mt-1 text-lg font-semibold text-ink">{formatAmount(item.lineTotal as number)} ₽</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
            <span className="text-base text-body">Subtotal</span>
            <span className="text-3xl font-semibold text-ink">{formatAmount(subtotal)} ₽</span>
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-body">
            <p>{deliverySummary.summary}</p>
            {selectedDeliveryOption ? <p className="mt-2">Выбранный способ: {selectedDeliveryOption.label}. {selectedDeliveryOption.feeLabel}.</p> : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-body">
            Если у способа получения нет точного тарифа, мы не включаем доставку в subtotal и не обещаем автоматический расчет. Онлайн-оплата на этом этапе не подключена.
          </p>
          {fieldErrors.items ? <p className="mt-3 text-xs leading-6 text-red-600">{fieldErrors.items}</p> : null}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {status.type === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              <p>{status.message}</p>
              {status.code === "checkout_unavailable" || status.code === "submission_unavailable" || status.code === "delivery_failed" || status.code === "server_error" ? (
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <Button href="/cart" variant="secondary" className="px-4 py-2.5">
                    Вернуться в корзину
                  </Button>
                  <Button href="/contacts" variant="ghost" className="px-4 py-2.5">
                    Открыть контакты
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {status.type === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              {status.message}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-body">Заказ отправляется только после успешного ответа сервера. Контекст корзины при ошибке не теряется.</p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправляем заказ..." : "Оформить заказ"}
            </Button>
          </div>
        </div>
      </form>

      <aside className="h-fit rounded-[32px] border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-28">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Что собираем</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-body">
          <p>Контактные данные для связи по заказу.</p>
          <p>Город и базовую информацию для доставки или получения.</p>
          <p>Комментарий, если есть важные условия по срокам или передаче.</p>
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-6 text-body">
          Этот checkout остается коротким: без кабинета, без промокодов, без автоматического расчета доставки и без сложной платежной логики.
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-4 text-sm leading-6 text-body">
          <p>{deliverySummary.summary}</p>
          {deliverySummary.manualReviewNote ? <p className="mt-2">{deliverySummary.manualReviewNote}</p> : null}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Button href="/cart" variant="secondary">
            Вернуться в корзину
          </Button>
          <Button href="/contacts" variant="ghost">
            Задать вопрос перед заказом
          </Button>
        </div>
      </aside>
    </div>
  );
}
