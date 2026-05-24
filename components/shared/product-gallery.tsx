import { ProductGalleryClient } from "@/components/shared/product-gallery-client";
import { type ProductImageTone, isTransparentProductAsset } from "@/components/shared/product-image-stage";
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
  const galleryTone = tone ?? inferGalleryTone(galleryImages);

  if (galleryImages.length) {
    return <ProductGalleryClient images={galleryImages} title={title} tone={galleryTone} />;
  }

  return (
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
  );
}
