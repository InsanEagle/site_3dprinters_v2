export type Category = {
  slug: string;
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  compatibility: string;
  price: string;
  material: string;
  color: string;
  leadTime: string;
  images: string[];
  shortDescription: string;
  description: string;
  installation: string;
  delivery: string;
  important: string;
  brand: string;
  model: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type EquipmentItem = {
  title: string;
  quantity: string;
  description: string;
};
