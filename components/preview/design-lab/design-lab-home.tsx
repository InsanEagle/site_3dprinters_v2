import Link from "next/link";
import { ProductImageStage } from "@/components/shared/product-image-stage";
import { resolveProductCardImage } from "@/data/product-image-assets";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { DesignLabActions } from "./design-lab-actions";

type DesignLabHomeProps = {
  products: Product[];
};

const inputMethods = [
  {
    label: "Фото",
    title: "Снимок детали или места установки",
    text: "Подходит для первого разбора, когда нужно понять форму, посадку и контекст вокруг детали.",
  },
  {
    label: "Образец",
    title: "Физическая деталь в руках",
    text: "Можно оттолкнуться от существующей детали, проверить геометрию и обсудить доработки.",
  },
  {
    label: "Описание",
    title: "Задача словами и размерами",
    text: "Достаточно для старта, если есть назначение изделия, примерные размеры и условия работы.",
  },
  {
    label: "3D-модель",
    title: "Готовый файл для подготовки",
    text: "Модель проверяется перед печатью, при необходимости обсуждаются материал и параметры.",
  },
];

const services = [
  {
    title: "Изготовление по образцу",
    text: "Когда есть старая деталь, фрагмент или понятная форма для повторения и доработки.",
  },
  {
    title: "3D-печать по модели",
    text: "Для готовых файлов и подготовленных изделий, где нужно проверить печатность и материал.",
  },
  {
    title: "Моделирование и доработка",
    text: "Когда нужно восстановить форму, изменить посадку или подготовить файл под FDM-печать.",
  },
  {
    title: "3D-сканирование",
    text: "Для сложной геометрии, где фото и ручных замеров недостаточно для уверенной подготовки.",
  },
  {
    title: "Небольшие серии",
    text: "Для повторяемых деталей после согласования модели, материала и требований к изделию.",
  },
];

const processSteps = [
  {
    title: "Задача",
    text: "Вы присылаете фото, образец, описание или готовую модель.",
  },
  {
    title: "Уточнение",
    text: "Разбираются размеры, посадка, материал, внешний вид и сценарий использования.",
  },
  {
    title: "Модель и подготовка",
    text: "Готовится или проверяется цифровая геометрия перед запуском FDM-печати.",
  },
  {
    title: "Печать",
    text: "Изделие изготавливается после согласования задачи и выбранного способа работы.",
  },
  {
    title: "Передача",
    text: "Результат сверяется с задачей, затем обсуждается удобный способ передачи.",
  },
];

function SectionIntro({
  label,
  title,
  text,
}: {
  label?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-3xl">
      {label ? <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{label}</p> : null}
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-body sm:text-lg">{text}</p> : null}
    </div>
  );
}

function WorkbenchHero({ products }: { products: Product[] }) {
  const primaryProduct = products[0];
  const supportingProducts = products.slice(1, 3);

  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,231,235,0.48)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.38)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="w-fit border border-line bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Preview concept A v1
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            FDM-детали и пластиковые изделия по вашей задаче
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-body sm:text-lg">
            Автомобильные пластиковые детали, крепеж, панели и нестандартные изделия. Начать можно с фото,
            образца, описания или готовой 3D-модели.
          </p>
          <div className="mt-7">
            <DesignLabActions source="preview-design-lab:hero" />
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 border border-line bg-white sm:grid-cols-4">
            {["Фото", "Образец", "Описание", "3D-модель"].map((item) => (
              <div key={item} className="border-line px-3 py-4 text-sm font-semibold text-ink [&:not(:last-child)]:border-r">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden border border-line bg-[#F6F7F8] p-3 sm:min-h-[520px] sm:p-5">
          <div className="absolute inset-x-5 top-5 h-px bg-line" />
          <div className="absolute bottom-5 left-5 top-5 w-px bg-line" />
          <div className="absolute right-5 top-5 h-24 w-24 border-r border-t border-line" />
          <div className="absolute bottom-5 left-5 h-20 w-32 border-b border-l border-line" />

          {primaryProduct ? (
            <Link
              href={`/product/${primaryProduct.slug}`}
              className="group absolute left-3 right-3 top-10 block rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-accent/35 sm:left-8 sm:right-auto sm:top-12 sm:w-[66%]"
            >
              <ProductImageStage
                image={resolveProductCardImage(primaryProduct)}
                title={primaryProduct.name}
                tone={primaryProduct.imageTone ?? "neutral"}
                priority
                frameClassName="min-h-[260px] px-5 py-6 sm:min-h-[330px] sm:px-8"
                imageClassName="max-h-[250px] sm:max-h-[310px]"
                className="shadow-[0_18px_48px_rgba(31,35,40,0.08)]"
              />
            </Link>
          ) : null}

          <div className="absolute bottom-5 right-3 z-20 w-[calc(100%-1.5rem)] border border-line bg-white p-4 shadow-[0_18px_45px_rgba(31,35,40,0.08)] sm:right-8 sm:w-[52%] sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Рабочий ввод</p>
            <p className="mt-3 text-xl font-semibold leading-7 text-ink">Не склад, а разбор задачи перед изготовлением</p>
            <p className="mt-3 text-sm leading-6 text-body">
              Каталог помогает увидеть типовые детали и быстро выбрать точку входа для запроса.
            </p>
          </div>

          <div className="absolute right-5 top-8 z-10 hidden w-48 gap-3 lg:grid">
            {supportingProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group block rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <ProductImageStage
                  image={resolveProductCardImage(product)}
                  title={product.name}
                  tone={product.imageTone ?? "neutral"}
                  size="thumbnail"
                  frameClassName="min-h-[128px] px-4 py-4"
                  imageClassName="max-h-[108px]"
                  className="rounded-[22px]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InputMethodsBlock() {
  return (
    <section className="border-b border-line bg-[#FBFBFC] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          label="Как начать"
          title="Четыре входа в одну рабочую задачу"
          text="Не обязательно иметь полный чертеж. Для первичного обсуждения важнее показать контекст, назначение и ограничения детали."
        />
        <div className="mt-9 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {inputMethods.map((method) => (
            <article key={method.label} className="bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold text-accent">{method.label}</p>
              <h3 className="mt-5 text-xl font-semibold leading-7 text-ink">{method.title}</h3>
              <p className="mt-4 text-sm leading-6 text-body">{method.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductExample({ product, index }: { product: Product; index: number }) {
  return (
    <article
      className={cn(
        "group grid gap-5 border border-line bg-white p-4 shadow-[0_8px_24px_rgba(31,35,40,0.035)] sm:p-5",
        index === 0 ? "lg:col-span-2 lg:grid-cols-[0.95fr_1.05fr]" : ""
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="block rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
      >
        <ProductImageStage
          image={resolveProductCardImage(product)}
          title={product.name}
          tone={product.imageTone ?? "neutral"}
          size={index === 0 ? "card" : "thumbnail"}
          className="rounded-[24px]"
        />
      </Link>
      <div className="flex flex-col">
        <p className="text-sm text-body">{product.categoryLabel}</p>
        <h3 className="mt-2 text-xl font-semibold leading-7 text-ink">
          <Link href={`/product/${product.slug}`} className="outline-none transition hover:text-accent focus-visible:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-4 text-sm leading-6 text-body">{product.shortDescription}</p>
        <div className="mt-auto pt-5">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            Открыть пример
          </Link>
        </div>
      </div>
    </article>
  );
}

function CatalogExamples({ products }: { products: Product[] }) {
  return (
    <section id="design-lab-examples" className="border-b border-line bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <SectionIntro
            label="Каталог как примеры"
            title="Реальные позиции показывают тип задач, а не фейковый склад"
            text="Это точки входа для обсуждения: можно открыть карточку, показать похожую деталь или попросить изготовить другой вариант."
          />
          <div className="border-l-4 border-accent bg-surface p-5 text-sm leading-6 text-body">
            Наличие, стоимость и способ изготовления уточняются по задаче. В этом preview не добавлены скидки,
            рейтинги, отзывы или складские статусы.
          </div>
        </div>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {products.slice(0, 5).map((product, index) => (
            <ProductExample key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceMatrix() {
  return (
    <section className="border-b border-line bg-[#FBFBFC] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          label="Рабочие зоны"
          title="Не одна услуга, а матрица подготовки детали"
          text="Маршрут зависит от исходных данных: иногда достаточно модели, иногда нужен образец, замер или сканирование."
        />
        <div className="mt-9 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title} className={cn("bg-white p-6", index === 4 ? "lg:col-span-2" : "")}>
              <p className="text-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 text-2xl font-semibold leading-8 text-ink">{service.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-body">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStack() {
  return (
    <section className="border-b border-line bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <SectionIntro
          label="Процесс"
          title="Задача проходит через уточнение, а не через мгновенную покупку"
          text="Такой сценарий честнее для FDM-деталей, где важны посадка, материал, геометрия и условия эксплуатации."
        />
        <div className="grid gap-3">
          {processSteps.map((step, index) => (
            <article key={step.title} className="grid gap-4 border border-line bg-surface p-4 sm:grid-cols-[8rem_1fr] sm:p-5">
              <div>
                <p className="text-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{step.title}</h3>
              </div>
              <p className="text-sm leading-6 text-body sm:pt-8">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequestBand() {
  return (
    <section className="bg-[#F6F7F8] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-7 border border-line bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Следующий шаг</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Покажите деталь или опишите задачу, дальше уточним рабочий маршрут
            </h2>
            <p className="mt-4 text-base leading-7 text-body">
              Можно приложить фото, написать размеры, описать проблему или отправить готовую 3D-модель.
              Итоговые параметры обсуждаются перед изготовлением.
            </p>
          </div>
          <DesignLabActions source="preview-design-lab:request-band" compact />
        </div>
      </div>
    </section>
  );
}

export function DesignLabHome({ products }: DesignLabHomeProps) {
  return (
    <main className="min-w-0 bg-white text-ink">
      <WorkbenchHero products={products} />
      <InputMethodsBlock />
      <CatalogExamples products={products} />
      <ServiceMatrix />
      <ProcessStack />
      <RequestBand />
    </main>
  );
}
