export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="grid gap-4">
      <div className="flex min-h-[360px] items-end rounded-3xl border border-dashed border-line bg-surface p-6">
        <div>
          <p className="text-sm font-medium text-body">Placeholder изображения</p>
          <p className="mt-2 text-base text-body">{images[0] || `TODO: фото для ${title}`}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.slice(1).map((image) => (
          <div key={image} className="flex min-h-[160px] items-end rounded-2xl border border-dashed border-line bg-surface p-4">
            <p className="text-sm text-body">{image}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

