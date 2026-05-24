import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { homeContent, productContent, servicesContent } from "@/data/content";
import { homepageFeaturedProducts } from "@/data/site";
import { getProductAvailabilityLabel, getProductPriceLabel, getProductSalesModeLabel } from "@/lib/catalog";
import { resolveProductCardImage } from "@/data/product-image-assets";

export const metadata = {
  robots: { index: false, follow: false }
};

const previewProducts = homepageFeaturedProducts.slice(0, 3);
const previewServices = servicesContent.slice(0, 2);

export default function DesignPreviewPage() {
  return (
    <div className="bg-white text-[#1F2328]">
      <PreviewHeader />
      <main>
        <PreviewHero />
        <ProductPreview />
        <ServicePreview />
        <ProcessPreview />
        <PreviewCTA />
      </main>
    </div>
  );
}

function PreviewHeader() {
  return (
    <div className="border-b border-[#E5E7EB] bg-white">
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          3D <span className="text-[#E86A2D]">Самурай</span>
        </Link>
        <div className="hidden min-w-0 items-center gap-5 text-sm font-medium text-[#4B5563] lg:flex">
          <Link href="/catalog" className="transition hover:text-[#1F2328]">Каталог</Link>
          <Link href="/custom" className="transition hover:text-[#1F2328]">Изготовление</Link>
          <Link href="/3d-scan" className="transition hover:text-[#1F2328]">3D-сканирование</Link>
          <Link href="/contacts" className="transition hover:text-[#1F2328]">Контакты</Link>
        </div>
        <Button href="/contacts" className="h-10 rounded-md px-4 py-2.5">
          Оставить заявку
        </Button>
      </Container>
    </div>
  );
}

function PreviewHero() {
  const heroProduct = previewProducts[0];
  const heroImage = heroProduct ? resolveProductCardImage(heroProduct) : null;

  return (
    <section className="border-b border-[#E5E7EB] py-14 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-[#E5E7EB] bg-[#F5F6F7] px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E86A2D]" />
              FDM 3D-печать / автомобильный пластик
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {homeContent.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg">
              {homeContent.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contacts" className="rounded-md">Оставить заявку</Button>
              <Button href="/catalog" variant="secondary" className="rounded-md">Смотреть каталог</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F5F6F7]">
              <div className="relative aspect-[4/5]">
                {heroImage && heroProduct ? (
                  <Image
                    src={heroImage}
                    alt={heroProduct.name}
                    fill
                    priority
                    className="object-contain p-8"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-8 text-center text-sm text-[#4B5563]">
                    Изображение появится после подготовки публичного ассета
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-3 border-t border-[#E5E7EB] pt-3 text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
              <span>Inquiry-first</span>
              <span>Цена и сроки после оценки</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProductPreview() {
  return (
    <section className="border-b border-[#E5E7EB] bg-[#F5F6F7] py-14 lg:py-20">
      <Container>
        <SectionIntro
          label="Catalog"
          title="Примеры публичных позиций"
          description="Карточки используют текущие опубликованные товары сайта. Коммерческие условия показываются только в рамках уже существующего inquiry-first сценария."
          actionHref="/catalog"
          actionLabel="Весь каталог"
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] md:grid-cols-2 lg:grid-cols-3">
          {previewProducts.map((product) => {
            const image = resolveProductCardImage(product);
            const price = getProductPriceLabel(product) ?? productContent.priceFallback;
            const availability = getProductAvailabilityLabel(product.availability);
            const salesMode = getProductSalesModeLabel(product.salesMode);

            return (
              <article key={product.slug} className="flex min-w-0 flex-col bg-white p-5 sm:p-6">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F5F6F7]">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain p-6 transition duration-300 hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#FDF1EA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E86A2D]">
                    SKU / {product.sku}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4B5563]">
                    {product.categoryLabel}
                  </span>
                </div>
                <h2 className="text-base font-semibold leading-6">
                  <Link href={`/product/${product.slug}`} className="transition hover:text-[#E86A2D]">
                    {product.name}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{product.shortDescription ?? product.compatibility}</p>
                <div className="mt-auto pt-5">
                  <div className="border-t border-[#E5E7EB] pt-3 text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
                    {price} / {salesMode} / {availability}
                  </div>
                  <Link href={`/product/${product.slug}`} className="mt-4 inline-flex text-sm font-semibold text-[#E86A2D] hover:underline">
                    Подробнее
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ServicePreview() {
  return (
    <section className="border-b border-[#E5E7EB] py-14 lg:py-20">
      <Container>
        <SectionIntro label="Services" title="Сценарии обращения" />
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] md:grid-cols-2">
          {previewServices.map((service, index) => (
            <Link
              key={service.slug}
              href={service.slug === "3d-scan" ? "/3d-scan" : `/${service.slug}`}
              className="group bg-white p-7 transition hover:bg-[#F5F6F7]"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
                Service / {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-xl font-semibold transition group-hover:text-[#E86A2D]">{service.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#4B5563]">{service.shortText}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-[#E86A2D]">Подробнее</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProcessPreview() {
  return (
    <section className="border-b border-[#E5E7EB] bg-[#F5F6F7] py-14 lg:py-20">
      <Container>
        <SectionIntro label="Workflow" title={homeContent.processTitle} />
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] md:grid-cols-2 lg:grid-cols-4">
          {homeContent.processSteps.map((step, index) => (
            <article key={step.title} className="bg-white p-6">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E86A2D]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">{step.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PreviewCTA() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E86A2D]">Inquiry</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Можно начать с короткого описания задачи
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4B5563]">
            Фото, размеры, образец или готовая модель помогают быстрее оценить способ изготовления. Стоимость, сроки и материал уточняются после запроса.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contacts" className="rounded-md">Оставить заявку</Button>
            <Button href="/custom" variant="secondary" className="rounded-md">Изготовление по образцу</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SectionIntro({
  label,
  title,
  description,
  actionHref,
  actionLabel
}: {
  label: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E86A2D]">{label}</span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-6 text-[#4B5563] sm:text-base">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="w-fit border-b border-[#1F2328]/40 pb-1 text-sm font-semibold transition hover:border-[#E86A2D] hover:text-[#E86A2D]">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
