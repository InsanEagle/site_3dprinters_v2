import { getProductImages } from "@/lib/catalog";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const galleryImages = getProductImages(images);
  const primaryImage = galleryImages[0];

  return (
    <div className="grid gap-4">
      {primaryImage ? (
        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <img src={primaryImage} alt={title} className="min-h-[360px] w-full object-cover" />
        </div>
      ) : (
        <div className="flex min-h-[360px] flex-col justify-between rounded-3xl border border-line bg-[linear-gradient(135deg,_#f6f7f8_0%,_#eceff3_100%)] p-6">
          <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-body">
            Изображения не опубликованы
          </span>
          <div>
            <p className="text-xl font-semibold text-ink">{title}</p>
            <p className="mt-2 max-w-lg text-base leading-7 text-body">
              По этой позиции пока доступно только описание и параметры для первичной оценки.
            </p>
          </div>
        </div>
      )}
      {galleryImages.length > 1 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {galleryImages.slice(1).map((image, index) => (
            <div key={image} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <img src={image} alt={`${title} — изображение ${index + 2}`} className="h-40 w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
