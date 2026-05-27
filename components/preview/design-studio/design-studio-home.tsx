import Image from "next/image";
import Link from "next/link";
import { DesignStudioRequestButton } from "@/components/preview/design-studio/design-studio-actions";
import { resolveProductCardImage } from "@/data/product-image-assets";
import { Product } from "@/types";

type DesignStudioHomeProps = {
  products: Product[];
};

type ProductSlotProps = {
  product?: Product;
  priority?: boolean;
  imageClassName?: string;
  frameClassName?: string;
};

const intakeMethods = [
  {
    title: "Фото",
    text: "Покажите деталь, место установки или поломку. Этого достаточно для первого разбора."
  },
  {
    title: "Образец",
    text: "Принесите старую деталь, фрагмент или пример формы, от которого можно оттолкнуться."
  },
  {
    title: "Описание",
    text: "Опишите назначение, ограничения, размеры и условия работы детали в автомобиле."
  },
  {
    title: "3D-модель",
    text: "Отправьте готовый файл. Его проверят перед подготовкой к FDM-печати."
  }
];

const process = [
  {
    title: "Задача",
    text: "Фиксируем входные данные: фото, образец, описание, размеры или модель."
  },
  {
    title: "Уточнение",
    text: "Разбираем посадку, материал, внешний вид и условия эксплуатации."
  },
  {
    title: "Модель",
    text: "Готовим или проверяем геометрию, если без этого нельзя уверенно печатать."
  },
  {
    title: "Печать",
    text: "Запускаем FDM-печать после согласования понятного рабочего маршрута."
  },
  {
    title: "Передача",
    text: "Сверяем результат с задачей и обсуждаем удобный способ получения."
  }
];

const garageScenarios = [
  "Крепеж и держатели для ремонта",
  "Рамки и накладки салона",
  "Заглушки и небольшие пластиковые элементы",
  "Деталь по фото или по старому образцу"
];

const atelierScenarios = [
  "Восстановить форму редкой детали",
  "Подготовить модель под печать",
  "Проверить посадку перед изготовлением",
  "Сделать аккуратную пластиковую замену"
];

const atlasScenarios = [
  "Салонные детали",
  "Кузовной пластик",
  "Ремонтный крепеж",
  "Панели и рамки",
  "Изделия на заказ"
];

const atelierImageWell =
  "border border-[#D8DEE3] bg-[#F4F6F7] bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:30px_30px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]";

function ProductSlot({ product, priority = false, imageClassName = "", frameClassName = "" }: ProductSlotProps) {
  if (!product) {
    return (
      <div className={["flex min-h-[180px] items-center justify-center bg-[#F3F4F6] text-sm text-[#4B5563]", frameClassName].join(" ")}>
        Пример детали
      </div>
    );
  }

  return (
    <div className={["relative flex min-h-[180px] items-center justify-center overflow-hidden", frameClassName].join(" ")}>
      <Image
        src={resolveProductCardImage(product)}
        alt={product.name}
        width={520}
        height={360}
        priority={priority}
        className={["h-auto max-h-full w-auto max-w-full object-contain", imageClassName].join(" ")}
      />
    </div>
  );
}

function StudioNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-[#D9DEE3] bg-[#F8FAFB]/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/preview/design-studio" className="text-sm font-semibold text-[#1F2328]">
          Design studio
        </Link>
        <div className="flex min-w-0 gap-1 overflow-x-auto text-xs font-semibold text-[#4B5563] sm:gap-2 sm:overflow-visible">
          <Link className="whitespace-nowrap px-3 py-2 hover:text-[#1F2328]" href="#garage-utility">
            Garage Utility
          </Link>
          <Link className="whitespace-nowrap px-3 py-2 hover:text-[#1F2328]" href="#technical-atelier">
            Technical Atelier
          </Link>
          <Link className="whitespace-nowrap px-3 py-2 hover:text-[#1F2328]" href="#parts-atlas">
            Parts Atlas
          </Link>
        </div>
      </div>
    </nav>
  );
}

function GarageUtility({ products }: { products: Product[] }) {
  const examples = products.slice(0, 4);

  return (
    <section id="garage-utility" className="bg-[#F4F5F4] text-[#202326]">
      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="border border-[#C9CED1] bg-[#ECEFEE]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-[#C9CED1] p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="w-fit border border-[#202326] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#202326]">
                Concept A
              </p>
              <h1 className="mt-8 max-w-2xl text-4xl font-black leading-[1.02] sm:text-5xl lg:text-6xl">
                Приемка задачи для FDM-детали
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#465057] sm:text-lg">
                Принесите фото, образец, размеры или модель. Разберем задачу до печати.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <DesignStudioRequestButton source="preview-design-studio:garage-hero" tone="garage" />
                <Link
                  href="#garage-examples"
                  className="inline-flex min-h-12 items-center justify-center border border-[#202326] bg-transparent px-5 py-3 text-sm font-semibold text-[#202326] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E86A2D]/35 focus-visible:ring-offset-2 active:translate-y-px"
                >
                  Смотреть примеры
                </Link>
              </div>
            </div>
            <div className="grid min-h-[440px] gap-3 p-3 sm:grid-cols-[1.3fr_0.7fr] sm:p-5">
              <div className="relative border border-[#202326] bg-[#FDFDFB] p-3">
                <div className="absolute left-3 top-3 h-10 w-16 border-l-4 border-t-4 border-[#E86A2D]" />
                <ProductSlot
                  product={examples[0]}
                  priority
                  frameClassName="min-h-[360px] bg-[linear-gradient(135deg,#FDFDFB,#E6E9EA)] px-6 py-8"
                  imageClassName="drop-shadow-[0_22px_24px_rgba(32,35,38,0.22)]"
                />
              </div>
              <div className="grid gap-3">
                {examples.slice(1, 3).map((product) => (
                  <div key={product.slug} className="border border-[#C9CED1] bg-[#FDFDFB] p-3">
                    <ProductSlot product={product} frameClassName="min-h-[165px] bg-[#F7F8F7] px-4 py-5" />
                  </div>
                ))}
                <div className="border border-[#202326] bg-[#202326] p-4 text-white">
                  <p className="text-sm font-semibold text-[#F0B08E]">Не складской статус</p>
                  <p className="mt-3 text-2xl font-black leading-tight">Каталог показывает похожие задачи.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#C9CED1] md:grid-cols-4">
            {intakeMethods.map((method) => (
              <article key={method.title} className="border-b border-[#C9CED1] p-5 md:border-b-0 md:border-r md:last:border-r-0">
                <h2 className="text-2xl font-black">{method.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[#465057]">{method.text}</p>
              </article>
            ))}
          </div>

          <div id="garage-examples" className="grid border-t border-[#C9CED1] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-[#C9CED1] p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">Сценарии с рабочего стола</h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#465057]">
                Подача ближе к сервисной приемке: быстро понять, с чем пришел человек и что нужно уточнить.
              </p>
            </div>
            <div className="grid gap-px bg-[#C9CED1] sm:grid-cols-2">
              {garageScenarios.map((scenario, index) => (
                <article key={scenario} className="bg-[#FDFDFB] p-5">
                  <ProductSlot product={examples[index]} frameClassName="mb-5 min-h-[150px] bg-[#ECEFEE] px-4 py-5" />
                  <h3 className="text-xl font-black leading-7">{scenario}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#465057]">Пример входа в разговор, а не обещание наличия на складе.</p>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#C9CED1] p-5 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-5">
              {process.map((step) => (
                <article key={step.title} className="border-l-4 border-[#E86A2D] bg-[#FDFDFB] p-4">
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#465057]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-5 border-t border-[#C9CED1] bg-[#202326] p-5 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">Начните как в мастерской: покажите деталь.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#D7DBDD]">
                Дальше можно уточнить материал, посадку, внешний вид и способ изготовления.
              </p>
            </div>
            <DesignStudioRequestButton source="preview-design-studio:garage-cta" tone="garage" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnicalAtelier({ products }: { products: Product[] }) {
  const examples = products.slice(1, 6);

  return (
    <section id="technical-atelier" className="bg-[#FBFBFA] text-[#191C1F]">
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#6C737A]">Concept B</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Техническая студия для пластиковых деталей
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#59616A]">
              Спокойная подача для задач, где важны форма, посадка и подготовка к печати.
            </p>
            <div className="mt-8">
              <DesignStudioRequestButton source="preview-design-studio:atelier-hero" tone="atelier" />
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden bg-[#EEF1F3]">
            <div className="absolute inset-x-8 top-8 h-px bg-[#C9D0D6]" />
            <div className="absolute bottom-8 left-8 top-8 w-px bg-[#C9D0D6]" />
            <div className="absolute right-6 top-6 w-[58%] bg-white p-5 shadow-[0_32px_80px_rgba(25,28,31,0.10)]">
              <ProductSlot product={examples[0]} priority frameClassName={`min-h-[260px] px-5 py-8 ${atelierImageWell}`} />
            </div>
            <div className="absolute bottom-8 left-6 w-[52%] bg-[#191C1F] p-5 text-white shadow-[0_28px_70px_rgba(25,28,31,0.18)]">
              <ProductSlot product={examples[1]} frameClassName={`min-h-[220px] px-5 py-7 ${atelierImageWell}`} />
              <p className="mt-5 text-xl font-semibold leading-7">Деталь как объект, а не карточка товара.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {intakeMethods.map((method) => (
            <article key={method.title} className="bg-[#EEF1F3] p-6">
              <h2 className="text-2xl font-semibold">{method.title}</h2>
              <p className="mt-5 text-sm leading-6 text-[#59616A]">{method.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">Примеры как инженерные объекты</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#59616A]">
              В этой версии каталог работает как витрина типов работ: восстановить, адаптировать, напечатать, проверить.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {atelierScenarios.map((scenario, index) => (
              <article key={scenario} className={index === 0 ? "bg-[#191C1F] p-5 text-white sm:col-span-2" : "bg-[#EEF1F3] p-5"}>
                <ProductSlot
                  product={examples[index]}
                  frameClassName={index === 0 ? `min-h-[260px] px-6 py-8 ${atelierImageWell}` : `min-h-[190px] px-5 py-6 ${atelierImageWell}`}
                />
                <h3 className="mt-5 text-2xl font-semibold leading-8">{scenario}</h3>
                <p className={index === 0 ? "mt-3 text-sm leading-6 text-[#D7DBDD]" : "mt-3 text-sm leading-6 text-[#59616A]"}>
                  Формулировка задачи важнее складской карточки.
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-[#EEF1F3] p-5 sm:p-8">
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Процесс без спешки к оплате</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {process.map((step) => (
              <article key={step.title} className="bg-[#FBFBFA] p-5">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#59616A]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 bg-[#191C1F] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Опишите деталь. Студия соберет рабочий маршрут.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#D7DBDD]">
              Подойдет фото, образец, описание с размерами или готовый файл модели.
            </p>
          </div>
          <DesignStudioRequestButton source="preview-design-studio:atelier-cta" tone="atelier" />
        </div>
      </div>
    </section>
  );
}

function PartsAtlas({ products }: { products: Product[] }) {
  const examples = products.slice(0, 5);

  return (
    <section id="parts-atlas" className="bg-[#F7F8F2] text-[#20322D]">
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="bg-[#234B43] p-6 text-white sm:p-8">
            <p className="text-sm font-semibold text-[#BFD7CA]">Concept C</p>
            <h1 className="mt-6 max-w-xl text-5xl font-black leading-[1.02] sm:text-6xl">Атлас деталей и задач</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#DDE9E1]">
              Каталог показывает направления работ: детали салона, кузовной пластик, крепеж и изделия на заказ.
            </p>
            <div className="mt-8">
              <DesignStudioRequestButton source="preview-design-studio:atlas-hero" tone="atlas" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {examples.slice(0, 3).map((product, index) => (
              <article key={product.slug} className={index === 1 ? "bg-[#E8EEE4] p-4 sm:row-span-2" : "bg-white p-4"}>
                <ProductSlot product={product} priority={index === 0} frameClassName="min-h-[210px] bg-[#F0F3EC] px-4 py-6" />
                <h2 className="mt-4 text-lg font-black leading-6">{product.categoryLabel}</h2>
                <p className="mt-2 text-sm leading-6 text-[#52645C]">Пример задачи из каталога.</p>
              </article>
            ))}
            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              {atlasScenarios.slice(3).map((scenario) => (
                <article key={scenario} className="bg-white p-5">
                  <h2 className="text-2xl font-black leading-8">{scenario}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#52645C]">Раздел для входа в обсуждение похожей детали.</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr]">
          {intakeMethods.map((method) => (
            <article key={method.title} className="border border-[#C7D1C6] bg-white p-5">
              <h2 className="text-2xl font-black">{method.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[#52645C]">{method.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Каталог без вида маркетплейса</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {atlasScenarios.map((scenario, index) => (
              <article key={scenario} className={index === 0 ? "bg-[#234B43] p-5 text-white lg:col-span-2" : "bg-white p-5"}>
                <ProductSlot
                  product={examples[index]}
                  frameClassName={index === 0 ? "min-h-[260px] bg-[#305C53] px-6 py-8" : "min-h-[180px] bg-[#F0F3EC] px-4 py-6"}
                />
                <h3 className="mt-5 text-2xl font-black leading-8">{scenario}</h3>
                <p className={index === 0 ? "mt-3 text-sm leading-6 text-[#DDE9E1]" : "mt-3 text-sm leading-6 text-[#52645C]"}>
                  Товарная карточка читается как пример похожей задачи.
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-5">
          {process.map((step) => (
            <article key={step.title} className="border border-[#C7D1C6] bg-[#E8EEE4] p-5">
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#52645C]">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">Найдите похожий сценарий и отправьте свою задачу.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#52645C]">
              Можно начать без точного названия детали. Достаточно показать, что нужно заменить или изготовить.
            </p>
          </div>
          <DesignStudioRequestButton source="preview-design-studio:atlas-cta" tone="atlas" />
        </div>
      </div>
    </section>
  );
}

export function DesignStudioHome({ products }: DesignStudioHomeProps) {
  return (
    <div className="min-w-0 bg-[#F8FAFB]">
      <StudioNav />
      <GarageUtility products={products} />
      <TechnicalAtelier products={products} />
      <PartsAtlas products={products} />
    </div>
  );
}
