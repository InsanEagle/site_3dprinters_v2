import { canProductBePurchasedDirectly } from "@/lib/catalog";
import { getSafeText } from "@/lib/content";
import { Product, ProductDeliveryClass } from "@/types";

export type DeliveryMethod = "delivery" | "pickup";

export type DeliveryMethodOption = {
  method: DeliveryMethod;
  label: string;
  description: string;
  note: string;
  requiresAddress: boolean;
  fee?: number;
  feeLabel: string;
  isFeeKnown: boolean;
  requiresManualConfirmation: boolean;
};

export type DeliverySelection = {
  selectedMethod: DeliveryMethod;
  selectedOption: DeliveryMethodOption;
  deliveryFee?: number;
  deliveryLabel: string;
  deliveryNote: string;
  commercialNote: string;
  fulfillmentNote: string;
};

export type DeliveryProfile = {
  deliveryClass: ProductDeliveryClass;
  availableMethods: DeliveryMethodOption[];
  summary: string;
  checkoutNote: string;
};

const deliveryMethodCatalog: Record<DeliveryMethod, Omit<DeliveryMethodOption, "method">> = {
  delivery: {
    label: "Доставка",
    description: "Отправка или передача через согласованный канал после подтверждения заказа.",
    note: "Точную стоимость и срок доставки подтверждаем вручную после оформления заказа.",
    requiresAddress: true,
    feeLabel: "Рассчитывается вручную после заказа",
    isFeeKnown: false,
    requiresManualConfirmation: true
  },
  pickup: {
    label: "Самовывоз",
    description: "Выдача заказа или способ передачи согласуется с менеджером после оформления.",
    note: "Подтверждаем место и порядок самовывоза вручную после оформления заказа.",
    requiresAddress: false,
    feeLabel: "Без автоматического расчета",
    isFeeKnown: false,
    requiresManualConfirmation: true
  }
};

const deliveryClassMethods: Record<ProductDeliveryClass, DeliveryMethod[]> = {
  standard: ["delivery", "pickup"],
  pickup_only: ["pickup"]
};

function createMethodOption(method: DeliveryMethod) {
  return {
    method,
    ...deliveryMethodCatalog[method]
  };
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function getDeliveryClassLabel(deliveryClass: ProductDeliveryClass) {
  return deliveryClass === "pickup_only" ? "Только самовывоз" : "Доставка или самовывоз";
}

export function getDeliveryProfile(product: Product): DeliveryProfile {
  const availableMethods = deliveryClassMethods[product.deliveryClass].map(createMethodOption);
  const customProductNote = getSafeText(product.delivery);
  const fallbackSummary =
    product.deliveryClass === "pickup_only"
      ? "Для этой позиции в onsite checkout оставляем только самовывоз с ручным подтверждением деталей."
      : "Для этой позиции доступны доставка и самовывоз. Точный расчет и подтверждение передачи заказа выполняются вручную.";

  return {
    deliveryClass: product.deliveryClass,
    availableMethods,
    summary: customProductNote ?? fallbackSummary,
    checkoutNote:
      product.deliveryClass === "pickup_only"
        ? "В checkout для этой позиции доступен только самовывоз."
        : "В checkout можно выбрать доставку или самовывоз. Точный shipping-расчет сайт пока не делает."
  };
}

export function getProductDeliverySummary(product: Product) {
  const profile = getDeliveryProfile(product);
  const methodLabels = profile.availableMethods.map((option) => option.label).join(" / ");

  return {
    ...profile,
    methodLabels,
    commercialSummary:
      profile.deliveryClass === "pickup_only"
        ? "Оформление возможно только с самовывозом и ручным подтверждением деталей передачи."
        : "Оформление остается честным: способ получения выбирается в checkout, а стоимость доставки подтверждается вручную, если точный расчет еще недоступен."
  };
}

export function getCartDeliveryOptions(products: Product[]): DeliveryMethodOption[] {
  if (!products.length) {
    return [];
  }

  const methods = (Object.keys(deliveryMethodCatalog) as DeliveryMethod[]).filter((method) =>
    products.every((product) => getDeliveryProfile(product).availableMethods.some((option) => option.method === method))
  );

  return methods.map(createMethodOption);
}

export function getCartDeliverySummary(products: Product[]) {
  if (!products.length) {
    return {
      options: [],
      isCheckoutSupported: true,
      summary: "Способ получения появится после добавления direct-sale позиций в корзину.",
      manualReviewNote: undefined as string | undefined
    };
  }

  const options = getCartDeliveryOptions(products);

  if (!options.length) {
    return {
      options,
      isCheckoutSupported: false,
      summary: "Для текущего набора товаров нет общего способа получения в onsite checkout. Нужна ручная обработка через контакты.",
      manualReviewNote: "Состав корзины требует ручного согласования способа получения."
    };
  }

  return {
    options,
    isCheckoutSupported: true,
    summary:
      options.length === 1
        ? `Для текущей корзины доступен только способ получения: ${options[0].label}.`
        : `Для текущей корзины доступны способы получения: ${options.map((option) => option.label).join(" и ")}.`,
    manualReviewNote: options.some((option) => option.requiresManualConfirmation)
      ? "Точный shipping-расчет сайт не имитирует: детали передачи и стоимость доставки при необходимости подтверждаются вручную."
      : undefined
  };
}

export function resolveDeliverySelection(products: Product[], requestedMethod: DeliveryMethod): DeliverySelection | undefined {
  const options = getCartDeliveryOptions(products);
  const selectedOption = options.find((option) => option.method === requestedMethod);

  if (!selectedOption) {
    return undefined;
  }

  const deliveryFee = typeof selectedOption.fee === "number" ? selectedOption.fee : undefined;
  const deliveryFeeText = typeof deliveryFee === "number" ? `${formatAmount(deliveryFee)} ₽` : selectedOption.feeLabel;

  return {
    selectedMethod: selectedOption.method,
    selectedOption,
    deliveryFee,
    deliveryLabel: selectedOption.label,
    deliveryNote: selectedOption.note,
    commercialNote:
      requestedMethod === "delivery"
        ? `Стоимость доставки: ${deliveryFeeText}. Точный срок и канал передачи подтверждаются после заказа.`
        : `Самовывоз оформляется без автоматического shipping-расчета. Место и порядок передачи подтверждаются после заказа.`,
    fulfillmentNote:
      requestedMethod === "delivery"
        ? "Заказ требует ручного подтверждения стоимости доставки и деталей передачи."
        : "Заказ требует ручного подтверждения самовывоза и деталей передачи."
  };
}

export function canProductsBePurchasedWithDeliveryMethod(products: Product[], method: DeliveryMethod) {
  return products.every((product) => canProductBePurchasedDirectly(product)) && Boolean(resolveDeliverySelection(products, method));
}
