import { ProductImageStage, ProductImageTone, isTransparentProductAsset } from "@/components/shared/product-image-stage";
import { getProductImages } from "@/lib/catalog";

function inferGalleryTone(images: string[]): ProductImageTone {
  return images.some((image) => isTransparentProductAsset(image)) ? "dark" : "neutral";
}

export function ProductGallery({
  images,
  title,
  tone
}: {
  images: string[];
  title: string;
  tone?: ProductImageTone;
}) {
  const galleryImages = getProductImages(images);
  const primaryImage = galleryImages[0];
  const galleryTone = tone ?? inferGalleryTone(galleryImages);

  return (
    <div className="grid content-start gap-4 self-start">
      {primaryImage ? (
        <ProductImageStage image={primaryImage} title={title} tone={galleryTone} size="gallery" className="self-start rounded-3xl" />
      ) : (
        <div className="flex min-h-[380px] flex-col justify-between self-start rounded-3xl border border-line bg-[linear-gradient(135deg,_#f6f7f8_0%,_#eceff3_100%)] p-6">
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
            <ProductImageStage
              key={image}
              image={image}
              title={`${title} — изображение ${index + 2}`}
              tone={galleryTone}
              size="thumbnail"
              className="rounded-2xl"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
