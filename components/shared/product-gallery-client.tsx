"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImageStage, type ProductImageTone } from "@/components/shared/product-image-stage";

type ProductGalleryClientProps = {
  images: string[];
  title: string;
  tone: ProductImageTone;
};

export function ProductGalleryClient({ images, title, tone }: ProductGalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const open = activeIndex !== null;
  const currentIndex = activeIndex ?? 0;
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPreviousImage = useCallback(() => {
    setActiveIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length));
  }, [images.length]);
  const showNextImage = useCallback(() => {
    setActiveIndex((index) => (index === null ? index : (index + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (hasMultipleImages && event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (hasMultipleImages && event.key === "ArrowRight") {
        showNextImage();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, hasMultipleImages, open, showNextImage, showPreviousImage]);

  return (
    <>
      <div className="grid content-start gap-4 self-start">
        <button
          type="button"
          data-testid="product-gallery-main-trigger"
          className="group block rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          onClick={() => setActiveIndex(0)}
          aria-label="Открыть изображение товара"
        >
          <ProductImageStage
            image={images[0]}
            title={title}
            tone={tone}
            size="gallery"
            chrome="minimal"
            className="self-start rounded-3xl transition group-hover:border-accent/45"
            frameClassName="min-h-[340px] px-3 py-3 md:min-h-[380px] md:px-4 md:py-4"
            imageClassName="!object-contain"
          />
        </button>
        {images.length > 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {images.slice(1).map((image, index) => {
              const imageIndex = index + 1;

              return (
                <button
                  key={image}
                  type="button"
                  className="group block rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                  onClick={() => setActiveIndex(imageIndex)}
                  aria-label={`Открыть изображение товара ${imageIndex + 1}`}
                >
                  <ProductImageStage
                    image={image}
                    title={`${title} — изображение ${imageIndex + 1}`}
                    tone={tone}
                    size="thumbnail"
                    chrome="minimal"
                    className="rounded-2xl transition group-hover:border-accent/45"
                    frameClassName="min-h-[180px] px-2.5 py-2.5"
                    imageClassName="!object-contain"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {open && currentImage ? (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/75 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div
            className="flex min-h-full items-center justify-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Галерея изображений товара"
              className="relative flex h-[calc(100dvh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:h-[calc(100dvh-3rem)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 bg-black/45 px-4 py-3 text-white backdrop-blur sm:px-5">
                <p className="text-sm font-semibold">{currentIndex + 1} / {images.length}</p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  onClick={closeLightbox}
                  aria-label="Закрыть галерею"
                >
                  Закрыть
                </button>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-16 sm:px-6">
                <Image
                  src={currentImage}
                  alt={`${title} — изображение ${currentIndex + 1}`}
                  width={1600}
                  height={1200}
                  className="max-h-full w-auto max-w-full object-contain"
                  priority
                />
              </div>

              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl leading-none text-white transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-5"
                    onClick={showPreviousImage}
                    aria-label="Предыдущее изображение"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl leading-none text-white transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-5"
                    onClick={showNextImage}
                    aria-label="Следующее изображение"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
