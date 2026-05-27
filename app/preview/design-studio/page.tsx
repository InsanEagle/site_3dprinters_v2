import type { Metadata } from "next";
import { DesignStudioHome } from "@/components/preview/design-studio/design-studio-home";
import { homepageFeaturedProducts } from "@/data/site";

export const metadata: Metadata = {
  title: "Preview: Design studio prototypes",
  description: "Три экспериментальных дизайн-направления для сайта FDM-производства автомобильных пластиковых деталей.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function DesignStudioPreviewPage() {
  return <DesignStudioHome products={homepageFeaturedProducts} />;
}
