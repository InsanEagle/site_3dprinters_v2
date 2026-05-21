import { Category, EquipmentItem, FaqItem, Product } from "@/types";
import {
  categories as catalogCategories,
  firstLaunchProducts as catalogFirstLaunchProducts,
  firstLaunchProductSkus as catalogFirstLaunchProductSkus,
  homepageFeaturedProducts as catalogHomepageFeaturedProducts,
  homepageFeaturedProductSkus as catalogHomepageFeaturedProductSkus,
  products as catalogProducts,
} from "@/data/catalog-public";

export const siteConfig = {
  name: "",
  shortName: "3D Самурай",
  phone: "",
  email: "",
  telegram: "",
  whatsapp: "",
  address: "",
  hours: "",
};

export const categories: Category[] = catalogCategories;

export const products: Product[] = catalogProducts;

export const firstLaunchProductSkus = catalogFirstLaunchProductSkus;

export const homepageFeaturedProductSkus = catalogHomepageFeaturedProductSkus;

export const firstLaunchProducts: Product[] = catalogFirstLaunchProducts;

export const homepageFeaturedProducts: Product[] = catalogHomepageFeaturedProducts;

export const faqItems: FaqItem[] = [
  {
    question: "Можно ли изготовить деталь, которой нет в каталоге?",
    answer:
      "Да. Каталог показывает только часть типовых позиций. Если нужной детали нет, можно отправить запрос по образцу, фото или описанию задачи.",
  },
  {
    question: "Можно ли обратиться только с фотографией?",
    answer:
      "Во многих случаях да. Для первичной оценки часто достаточно фото, примерных размеров и краткого описания задачи.",
  },
  {
    question: "Когда нужен 3D-скан?",
    answer:
      "Он полезен, когда нужно получить цифровую геометрию сложной детали для дальнейшей доработки или изготовления.",
  },
  {
    question: "Можно ли изготовить одну деталь?",
    answer:
      "Да, работа может начинаться и с единичного изделия, если задача подходит по технологии.",
  },
  {
    question: "Как понять, какой материал подойдет?",
    answer:
      "Материал подбирается после оценки нагрузки, условий эксплуатации и требований к внешнему виду.",
  },
  {
    question: "Можно ли заказать небольшую серию?",
    answer:
      "Да, после оценки модели и согласования параметров можно обсудить повторяемое изготовление.",
  },
];

export const equipment: EquipmentItem[] = [];

export const processSteps = [
  "Вы отправляете фото, размеры, описание, образец или готовую 3D-модель.",
  "Задача оценивается и уточняется, какой способ работы подойдет лучше.",
  "Согласовываются параметры изделия и дальнейший порядок работы.",
  "После согласования запускается изготовление и передача готового изделия.",
];

export const homeCases: Array<{ title: string; text: string }> = [];
