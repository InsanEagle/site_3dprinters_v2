import type { Metadata } from "next";
import { DesignStudioBHome } from "@/components/preview/design-studio-b/design-studio-b-home";
import { homepageFeaturedProducts } from "@/data/site";

export const metadata: Metadata = {
  title: "Preview: Technical Atelier",
  description:
    "Preview-прототип главной страницы Technical Atelier для FDM-печати автомобильных пластиковых деталей и изделий по задаче.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DesignStudioBPreviewPage() {
  return <DesignStudioBHome products={homepageFeaturedProducts} />;
}
