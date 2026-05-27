import type { Metadata } from "next";
import { DesignLabHome } from "@/components/preview/design-lab/design-lab-home";
import { homepageFeaturedProducts } from "@/data/site";

export const metadata: Metadata = {
  title: "Preview: Technical bench concept",
  description: "Экспериментальный preview-дизайн для FDM-изготовления пластиковых деталей.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DesignLabPreviewPage() {
  return <DesignLabHome products={homepageFeaturedProducts} />;
}
