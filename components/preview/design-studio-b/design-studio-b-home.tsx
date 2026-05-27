import Image from "next/image";
import Link from "next/link";
import { AtelierRequestButton } from "@/components/preview/design-studio-b/design-studio-b-actions";
import { resolveProductCardImage } from "@/data/product-image-assets";
import { Product } from "@/types";

type DesignStudioBHomeProps = {
  products: Product[];
};

type ProductObjectProps = {
  product: Product;
  priority?: boolean;
  size?: "large" | "medium" | "small";
  className?: string;
};

const inputMethods = [
  {
    title: "Фото",
    text: "Снимок детали, места установки или поломки помогает начать обсуждение без чертежа.",
  },
  {
    title: "Образец",
    text: "Старая деталь, фрагмент или похожая форма дают опору для повторения и доработки.",
  },
  {
    title: "Описание и размеры",
    text: "Подойдет назначение детали, ограничения по посадке, размеры и условия работы.",
  },
  {
    title: "Готовая 3D-модель",
    text: "Файл можно проверить перед подготовкой к FDM-печати и обсудить материал.",
  },
];

const capabilities = [
  {
    title: "Изготовление по образцу",
    text: "Когда есть деталь, фрагмент или понятная форма, от которой можно оттолкнуться.",
  },
  {
    title: "3D-печать по модели",
    text: "Для готовых файлов и подготовленных изделий, где нужно проверить печатность.",
  },
  {
    title: "Моделирование и доработка",
    text: "Для восстановления формы, изменения посадки или подготовки файла под FDM-печать.",
  },
  {
    title: "3D-сканирование",
    text: "Для сложной геометрии, когда фото и ручных замеров недостаточно для подготовки.",
  },
  {
    title: "Небольшие серии",
    text: "Для повторяемых деталей после согласования модели, материала и требований.",
  },
];

const processSteps = [
  {
    title: "Задача",
    text: "Вы присылаете фото, образец, описание, размеры или готовую 3D-модель.",
  },
  {
    title: "Уточнение",
    text: "Обсуждаются посадка, материал, внешний вид и условия использования детали.",
  },
  {
    title: "Модель и подготовка",
    text: "Геометрия готовится или проверяется перед запуском FDM-печати.",
  },
  {
    title: "Печать",
    text: "Изготовление начинается после согласования понятного рабочего маршрута.",
  },
  {
    title: "Передача",
    text: "Результат сверяется с задачей, затем обсуждается удобный способ получения.",
  },
];

const imageWellClassName =
  "rounded-[6px] border border-[#D8DEE3] bg-[#F5F7F8] bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:32px_32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]";

function ProductObject({ product, priority = false, size = "medium", className = "" }: ProductObjectProps) {
  const sizeClassName = {
    large: "min-h-[290px] sm:min-h-[360px]",
    medium: "min-h-[220px]",
    small: "min-h-[170px]",
  }[size];

  const imageClassName = {
    large: "max-h-[290px] sm:max-h-[340px]",
    medium: "max-h-[210px]",
    small: "max-h-[150px]",
  }[size];

  return (
    <div className={["relative flex items-center justify-center overflow-hidden p-6", imageWellClassName, sizeClassName, className].join(" ")}>
      <div className="pointer-events-none absolute left-4 top-4 h-10 w-14 rounded-[3px] border-l border-t border-[#B9C2C9]" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-14 rounded-[3px] border-b border-r border-[#B9C2C9]" />
      <Image
        src={resolveProductCardImage(product)}
        alt={product.name}
        width={640}
        height={440}
        priority={priority}
        sizes={size === "large" ? "(min-width: 1024px) 44vw, 92vw" : "(min-width: 1024px) 25vw, 92vw"}
        className={["h-auto w-auto max-w-full object-contain drop-shadow-[0_24px_28px_rgba(31,35,40,0.20)]", imageClassName].join(" ")}
      />
    </div>
  );
}

function PreviewNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-[#FBFBFA]/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/preview/design-studio" className="whitespace-nowrap text-sm font-semibold text-[#202428]">
          Design studio
        </Link>
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto text-sm font-medium text-[#5A626B] sm:overflow-visible">
          <Link href="#examples" className="whitespace-nowrap rounded-[6px] px-3 py-2 transition hover:bg-[#EEF1F3] hover:text-[#202428]">
            Примеры
          </Link>
          <Link href="#capabilities" className="whitespace-nowrap rounded-[6px] px-3 py-2 transition hover:bg-[#EEF1F3] hover:text-[#202428]">
            Возможности
          </Link>
          <Link href="#process" className="whitespace-nowrap rounded-[6px] px-3 py-2 transition hover:bg-[#EEF1F3] hover:text-[#202428]">
            Процесс
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroAtelier({ products }: { products: Product[] }) {
  const heroProducts = products.slice(0, 3);

  return (
    <section className="border-b border-[#E5E7EB] bg-[#FBFBFA]">
      <div className="mx-auto grid min-h-[calc(100dvh-64px)] max-w-[1360px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] text-[#171A1D] sm:text-5xl lg:text-6xl">
            Technical Atelier для FDM-деталей
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#4B5563] sm:text-lg">
            FDM-печать автомобильных пластиковых деталей и изделий по фото, образцу, описанию, размерам или готовой 3D-модели.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AtelierRequestButton source="preview-design-studio-b:hero" />
            <Link
              href="#examples"
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] border border-[#C9D0D6] bg-white px-5 py-3 text-sm font-semibold text-[#202428] transition hover:border-[#202428] hover:bg-[#F3F5F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E86A2D]/30 focus-visible:ring-offset-2 active:translate-y-px"
            >
              Смотреть примеры
            </Link>
          </div>
        </div>

        <div className="relative min-h-[520px] rounded-[6px] border border-[#D9DEE3] bg-[#EEF1F3] p-3 sm:p-5 lg:min-h-[620px]">
          <div className="absolute inset-x-6 top-6 h-px bg-[#C4CBD1]" />
          <div className="absolute bottom-6 left-6 top-6 w-px bg-[#C4CBD1]" />
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            {heroProducts[0] ? (
              <div className="lg:pt-12">
                <ProductObject product={heroProducts[0]} priority size="large" />
              </div>
            ) : null}
            <div className="grid gap-4 lg:pb-10">
              {heroProducts.slice(1, 3).map((product) => (
                <ProductObject key={product.slug} product={product} size="small" />
              ))}
              <div className="rounded-[6px] bg-[#202428] p-5 text-white shadow-[0_24px_70px_rgba(31,35,40,0.14)]">
                <p className="text-2xl font-semibold leading-8">Деталь сначала рассматривается как инженерная задача.</p>
                <p className="mt-4 text-sm leading-6 text-[#D7DBDD]">Каталог помогает выбрать похожий вход, но не заменяет уточнение перед изготовлением.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputMethods() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight text-[#171A1D] sm:text-5xl">Начать можно с разных исходных данных</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#4B5563]">
            Для первого обсуждения не нужен идеальный чертеж. Важно показать контекст, назначение и ограничения детали.
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1.05fr_0.95fr]">
          {inputMethods.map((method, index) => (
            <article
              key={method.title}
              className={[
                "rounded-[6px] border border-[#E1E5E8] bg-[#F7F8F8] p-6",
                index === 1 ? "lg:mt-10" : "",
                index === 2 ? "lg:mt-4" : "",
              ].join(" ")}
            >
              <h3 className="text-2xl font-semibold text-[#171A1D]">{method.title}</h3>
              <p className="mt-5 text-sm leading-6 text-[#4B5563]">{method.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductExamples({ products }: { products: Product[] }) {
  const examples = products.slice(0, 5);

  return (
    <section id="examples" className="border-b border-[#E5E7EB] bg-[#FBFBFA] py-14 sm:py-20">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight text-[#171A1D] sm:text-5xl">Примеры как объекты на стенде</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#4B5563]">
            Это реальные позиции из каталога. Они показывают типы задач, а не складские обещания.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-6">
          {examples.map((product, index) => (
            <article
              key={product.slug}
              className={[
                "rounded-[6px] border border-[#DDE3E7] bg-white p-4 shadow-[0_14px_40px_rgba(31,35,40,0.045)]",
                index === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3 xl:col-span-3",
              ].join(" ")}
            >
              <Link href={`/product/${product.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#E86A2D]/35">
                <ProductObject product={product} priority={index === 0} size={index === 0 ? "large" : "medium"} />
              </Link>
              <div className="mt-5">
                <p className="text-sm font-medium text-[#69727B]">{product.categoryLabel}</p>
                <h3 className="mt-2 text-xl font-semibold leading-7 text-[#171A1D]">
                  <Link href={`/product/${product.slug}`} className="transition hover:text-[#C95724] focus-visible:outline-none focus-visible:text-[#C95724]">
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#4B5563]">{product.shortDescription}</p>
                <p className="mt-4 text-sm font-semibold text-[#C95724]">Пример задачи для обсуждения</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitySection() {
  return (
    <section id="capabilities" className="border-b border-[#E5E7EB] bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1360px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div className="rounded-[6px] bg-[#202428] p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Мастерская под задачу, а не витрина остатков</h2>
          <p className="mt-5 text-base leading-7 text-[#D7DBDD]">
            Маршрут зависит от исходных данных: иногда достаточно модели, иногда нужен образец, замер или сканирование.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map((capability, index) => (
            <article
              key={capability.title}
              className={[
                "rounded-[6px] border border-[#E1E5E8] bg-[#F7F8F8] p-6",
                index === 2 ? "md:row-span-2 md:flex md:flex-col md:justify-end md:bg-[#EEF1F3]" : "",
                index === 4 ? "md:col-span-2" : "",
              ].join(" ")}
            >
              <h3 className="text-2xl font-semibold leading-8 text-[#171A1D]">{capability.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#4B5563]">{capability.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="process" className="border-b border-[#E5E7EB] bg-[#FBFBFA] py-14 sm:py-20">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight text-[#171A1D] sm:text-5xl">Задача проходит через уточнение</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#4B5563]">
            Процесс оставляет место для вопросов до изготовления. На этой странице нет обещаний по срокам, точности или наличию.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {processSteps.map((step) => (
            <article key={step.title} className="relative rounded-[6px] border border-[#DDE3E7] bg-white p-5">
              <div className="mb-6 h-px w-full bg-[#D1D7DC]" />
              <h3 className="text-xl font-semibold text-[#171A1D]">{step.title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#4B5563]">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalRequest({ product }: { product?: Product }) {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1360px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:px-8">
        <div className="rounded-[6px] border border-[#DDE3E7] bg-[#FBFBFA] p-6 sm:p-8">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[#171A1D] sm:text-5xl">Покажите деталь, а рабочий маршрут можно собрать после заявки</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#4B5563]">
            Подойдет фото, образец, описание с размерами или готовый файл. Дальше задача уточняется перед изготовлением.
          </p>
          <div className="mt-8">
            <AtelierRequestButton source="preview-design-studio-b:final" variant="dark" />
          </div>
        </div>
        {product ? (
          <div className="rounded-[6px] bg-[#202428] p-4 shadow-[0_30px_90px_rgba(31,35,40,0.14)]">
            <ProductObject product={product} size="medium" />
            <p className="mt-5 px-1 text-sm leading-6 text-[#D7DBDD]">Черные FDM-детали остаются на светлом стенде, даже когда рядом используется темная панель.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function DesignStudioBHome({ products }: DesignStudioBHomeProps) {
  return (
    <main className="min-w-0 bg-[#FBFBFA] text-[#171A1D]">
      <PreviewNav />
      <HeroAtelier products={products} />
      <InputMethods />
      <ProductExamples products={products} />
      <CapabilitySection />
      <ProcessSection />
      <FinalRequest product={products[5] ?? products[0]} />
    </main>
  );
}
