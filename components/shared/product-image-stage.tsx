import { cn } from "@/lib/utils";

export type ProductImageTone = "neutral" | "dark";
export type ProductImageStageSize = "card" | "gallery" | "thumbnail";

type ProductImageStageProps = {
  image: string;
  title: string;
  tone?: ProductImageTone;
  size?: ProductImageStageSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  testId?: string;
};

export function isTransparentProductAsset(image: string) {
  return /\.png($|\?)/i.test(image);
}

function getStagePalette(tone: ProductImageTone) {
  if (tone === "dark") {
    return {
      surface:
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,248,249,0.98)_34%,rgba(238,241,245,1)_100%)]",
      panel:
        "bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.99)_0%,rgba(251,252,253,0.95)_38%,rgba(242,245,248,0.64)_72%,rgba(242,245,248,0)_100%)]",
      glow: "bg-[rgba(31,35,40,0.18)]",
      dropShadow: "drop-shadow-[0_22px_34px_rgba(31,35,40,0.18)]"
    };
  }

  return {
    surface:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(248,249,250,0.98)_38%,rgba(240,243,246,1)_100%)]",
    panel:
      "bg-[radial-gradient(circle_at_50%_33%,rgba(255,255,255,0.98)_0%,rgba(250,251,252,0.88)_40%,rgba(243,246,248,0.24)_72%,rgba(243,246,248,0)_100%)]",
    glow: "bg-[rgba(31,35,40,0.12)]",
    dropShadow: "drop-shadow-[0_18px_28px_rgba(31,35,40,0.12)]"
  };
}

function getStageSize(size: ProductImageStageSize) {
  switch (size) {
    case "gallery":
      return {
        frame: "min-h-[380px] px-8 py-8 md:min-h-[420px] md:px-10 md:py-9",
        image: "max-h-[340px] md:max-h-[380px]",
        panelInset: "inset-x-[6%] inset-y-[8%] rounded-[30px]",
        glow: "inset-x-[18%] bottom-7 h-12"
      };
    case "thumbnail":
      return {
        frame: "min-h-[220px] px-5 py-5",
        image: "max-h-[180px]",
        panelInset: "inset-x-[8%] inset-y-[10%] rounded-[22px]",
        glow: "inset-x-[20%] bottom-5 h-9"
      };
    default:
      return {
        frame: "h-64 px-6 py-5 sm:h-72 sm:px-8",
        image: "max-h-full",
        panelInset: "inset-x-[7%] inset-y-[9%] rounded-[24px]",
        glow: "inset-x-[18%] bottom-6 h-10"
      };
  }
}

export function ProductImageStage({
  image,
  title,
  tone,
  size = "card",
  className,
  imageClassName,
  priority = false,
  testId
}: ProductImageStageProps) {
  const transparentAsset = isTransparentProductAsset(image);
  const resolvedTone = tone ?? (transparentAsset ? "dark" : "neutral");
  const palette = getStagePalette(resolvedTone);
  const scale = getStageSize(size);

  return (
    <div
      data-testid={testId}
      className={cn("relative overflow-hidden rounded-[28px] border border-line/80 bg-[#f7f8fa]", className)}
    >
      <div className={cn("absolute inset-0", palette.surface)} />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.44)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0.24)_100%)]" />
      <div className={cn("absolute border border-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]", scale.panelInset, palette.panel)} />
      <div className={cn("absolute rounded-full blur-2xl", scale.glow, palette.glow)} />
      <div className="absolute inset-x-[12%] bottom-4 h-px bg-white/70" />
      <div className={cn("relative flex items-center justify-center", scale.frame)}>
        <img
          src={image}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full transition duration-300 group-hover:scale-[1.02]",
            scale.image,
            transparentAsset ? "object-contain" : "object-cover",
            palette.dropShadow,
            imageClassName
          )}
        />
      </div>
    </div>
  );
}
