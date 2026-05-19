import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "ozon_data");
const outputFile = path.join(rootDir, "data", "ozon-catalog.ts");

const baseCategories = [
  {
    slug: "moldings",
    title: "Молдинги и кузовные элементы",
    description: "Наружные пластиковые детали, молдинги, накладки и другие кузовные элементы для замены или подбора по образцу."
  },
  {
    slug: "panels",
    title: "Панели, консоли и воздуховоды",
    description: "Центральные консоли, рамки, воздуховоды и другие детали, где важны посадка, геометрия и аккуратный внешний вид."
  },
  {
    slug: "interior",
    title: "Элементы салона",
    description: "Накладки, крышки, декоративные и прикладные детали салона, которые подбираются под конкретную модель или задачу."
  },
  {
    slug: "fasteners",
    title: "Крепления, клипсы и заглушки",
    description: "Небольшие прикладные элементы для замены утерянных, сломанных или изношенных деталей."
  },
  {
    slug: "custom-parts",
    title: "Редкие и специальные детали",
    description: "Позиции со специфической совместимостью, технические детали и редкие элементы, которые удобнее уточнять по параметрам."
  }
];

const categoryPriority = {
  panels: 0,
  interior: 1,
  fasteners: 2,
  moldings: 3,
  "custom-parts": 4
};

const categoryMap = {
  "Накладки и молдинги": "moldings",
  "Кузовные детали": "moldings",
  "Центральные консоли и рамки": "panels",
  "Воздуховоды и дефлекторы": "panels",
  "Элементы салона": "interior",
  "Эмблемы и декор": "interior",
  "Крепления и клипсы": "fasteners",
  "Дверные ручки и лючки": "custom-parts",
  "Детали двигателя и техчасть": "custom-parts",
  "Прочее": "custom-parts"
};

const stronglyRelevantCategories = new Set([
  "Накладки и молдинги",
  "Кузовные детали",
  "Центральные консоли и рамки",
  "Воздуховоды и дефлекторы",
  "Элементы салона",
  "Эмблемы и декор",
  "Крепления и клипсы"
]);

const requiresVehicleMatch = new Set(["Дверные ручки и лючки", "Детали двигателя и техчасть", "Прочее"]);

const exclusionPattern =
  /\b(закладк|книга|садху|гигиеническ|кофемашин|принтер|лазер|гравиров|датчик|нагревательн|аккумулятор|батаре|душ|холодильник|станок|кофе|bayliner|яхт|wmf|miele|kyosera|volcano|ts100|ts101|liitokala|гравировальн|резак|паяльник|свароч|плата\b|контейнер универсальн|декоративная крышка для нижней части вентилятора|игрушечн|радиоуправля|wpl\b|mn82\b)\b/i;

const vehiclePattern =
  /\b(toyota|chrysler|volkswagen|vw|bmw|mercedes|mercedes-benz|audi|lexus|mazda|nissan|honda|subaru|mitsubishi|jeep|ford|land cruiser|pt cruiser|mark ii|mark 2|cresta|chaser|soarer|supra|verossa|transporter|carina|corolla|sprinter|b-class|w245|w246|w222|jzx\d+|gx\d+|ae\d+|at\d+|автомоб|авто|салон|торпед|консол|панел|подлокот|воздуховод|дефлект|молдинг|клипс|креплен|заглуш|люк|лючок|бензобак|двер|грм|двигател|тормоз|бампер|решетк|эмблем|кузов)\b/i;

const brandPattern =
  /\b(Toyota|Chrysler|Volkswagen|VW|BMW|Mercedes(?:-Benz)?|Audi|Lexus|Mazda|Nissan|Honda|Subaru|Mitsubishi|Jeep|Ford|Dodge|Land Rover|Range Rover|Porsche|Skoda|Renault|Peugeot|Citroen|Volvo|Opel|Chevrolet|Cadillac|Infiniti|Jaguar|Suzuki|Kia|Hyundai|ГАЗ)\b/i;

const importantPattern = /\b(оем|oem|артикул|в комплект не входит|не входит|устанавливается|установка)\b/i;

const cyrillicMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya"
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        value += char;
      }

      continue;
    }

    if (char === '"') {
      quoted = true;
      continue;
    }

    if (char === ";") {
      row.push(value);
      value = "";
      continue;
    }

    if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headers, ...records] = rows;

  return records
    .filter((record) => record.some((cell) => cell && cell.trim()))
    .map((record) =>
      Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""]))
    );
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeWhitespace(value) {
  return value.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

function sanitizeText(value) {
  return normalizeWhitespace(stripHtml(String(value ?? "")));
}

function shorten(value, maxLength) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim().replace(/[.,;:!?-]+$/, "")}…`;
}

function slugify(value) {
  const transliterated = value
    .toLowerCase()
    .split("")
    .map((char) => cyrillicMap[char] ?? char)
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseCharacteristics(value) {
  const entries = sanitizeText(value)
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  const map = {};

  for (const entry of entries) {
    const [rawKey, ...rest] = entry.split(":");

    if (!rawKey || !rest.length) {
      continue;
    }

    map[rawKey.trim().toLowerCase()] = rest.join(":").trim();
  }

  return map;
}

function collectImages(row, merged) {
  const csvImages = unique(
    String(row.Photo ?? "")
      .split(/\s*,\s*/)
      .map((image) => image.trim())
  );
  const apiImages = unique([
    merged?.pictures?.primary_photo,
    ...(Array.isArray(merged?.pictures?.photo) ? merged.pictures.photo : [])
  ]);

  return unique([...apiImages, ...csvImages]).filter((image) => /^https?:\/\//i.test(image));
}

function pickDescription(row, merged) {
  return sanitizeText(merged?.description || row.Text || row.Description || "");
}

function extractCompatibility(text) {
  if (!text) {
    return "";
  }

  const match = text.match(/Подходит для:\s*([\s\S]*?)(?=(?:Деталь|Изделие|Товар)\s+изготов|OEM|ОЕМ|Артикул|Устанавливается|$)/i);

  if (match) {
    return shorten(normalizeWhitespace(match[1]), 260);
  }

  return "";
}

function extractInstallation(text) {
  const sentences = text.match(/[^.!?]*устанавливается[^.!?]*[.!?]?/gi);

  if (!sentences?.length) {
    return "";
  }

  return shorten(normalizeWhitespace(sentences.join(" ")), 220);
}

function extractImportant(text) {
  if (!text) {
    return "";
  }

  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => importantPattern.test(line));

  return shorten(lines.join(" "), 240);
}

function buildName(row, description) {
  let name = sanitizeText(row.Title || row.Description || description);

  name = name
    .replace(/\s+Подходит для:.*$/i, "")
    .replace(/\s+(?:предназначен(?:а|о|ы)?|специально\s+разработан(?:а|о|ы)?|выполнен(?:а|о|ы)?|изготовлен(?:а|о|ы)?|используется)\b[\s\S]*$/i, "")
    .replace(/\s+[—-]\s+это.*$/i, "")
    .replace(/\s+[—-]\s+Точный аналог.*$/i, "")
    .replace(/\.\s.*$/, "")
    .trim();

  const words = name.split(/\s+/).filter(Boolean);

  if (words.length > 12) {
    name = `${words.slice(0, 12).join(" ")}…`;
  }

  return shorten(name, 120);
}

function buildShortDescription(name, description) {
  const basis = description || name;
  const sentence = basis.split(/(?<=[.!?])\s+/)[0]?.trim() || basis;
  return shorten(sentence, 220);
}

function isRelevantRecord(row, merged, combinedText) {
  if (!merged || merged.list_item?.archived) {
    return false;
  }

  if (exclusionPattern.test(combinedText)) {
    return false;
  }

  if (requiresVehicleMatch.has(row.Category || "")) {
    return vehiclePattern.test(combinedText);
  }

  if (stronglyRelevantCategories.has(row.Category || "")) {
    return true;
  }

  return vehiclePattern.test(combinedText);
}

function mapCategory(categoryName) {
  return categoryMap[categoryName] ?? "custom-parts";
}

function buildSalesMode(merged) {
  return merged?.list_item?.has_fbo_stocks || merged?.list_item?.has_fbs_stocks ? "marketplace" : "inquiry";
}

function buildAvailability(merged) {
  return merged?.list_item?.has_fbo_stocks || merged?.list_item?.has_fbs_stocks ? "in_stock" : "on_request";
}

function buildPricing(mode) {
  return mode === "marketplace"
    ? {
        type: "on_request",
        note: "Актуальная цена и наличие уточняются по текущему каналу продажи."
      }
    : {
        type: "on_request",
        note: "Цена уточняется после запроса по параметрам изделия."
      };
}

function resolveBrand(row, characteristics, compatibility, name) {
  const explicitBrand = sanitizeText(row.Brand) || characteristics["марка"];
  const inferredBrand = brandPattern.exec(`${compatibility} ${name}`)?.[0] ?? "";

  return explicitBrand || inferredBrand;
}

function resolveColor(characteristics) {
  const color = characteristics["цвет"];

  if (!color) {
    return "";
  }

  if (color.length > 60) {
    return "";
  }

  return color;
}

function buildMarketplace() {
  return { provider: "ozon" };
}

function serializeValue(value, indentLevel = 0) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return "[]";
    }

    const nextIndent = "  ".repeat(indentLevel + 1);
    const currentIndent = "  ".repeat(indentLevel);

    return `[\n${value.map((item) => `${nextIndent}${serializeValue(item, indentLevel + 1)}`).join(",\n")}\n${currentIndent}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);

    if (!entries.length) {
      return "{}";
    }

    const nextIndent = "  ".repeat(indentLevel + 1);
    const currentIndent = "  ".repeat(indentLevel);

    return `{\n${entries
      .map(([key, entry]) => `${nextIndent}${key}: ${serializeValue(entry, indentLevel + 1)}`)
      .join(",\n")}\n${currentIndent}}`;
  }

  return JSON.stringify(value);
}

const mergedProducts = readJson(path.join(sourceDir, "products_full.fixed.json"));
const descriptionMap = readJson(path.join(sourceDir, "product_descriptions_raw.fixed.json"));
const csvRows = parseCsv(fs.readFileSync(path.join(sourceDir, "tilda_import.csv"), "utf8").replace(/^\uFEFF/, ""));

const mergedByOfferId = new Map(mergedProducts.map((item) => [String(item.offer_id || ""), item]));
const mergedByProductId = new Map(mergedProducts.map((item) => [String(item.product_id || ""), item]));

const seenFingerprints = new Set();
const products = [];
const excluded = [];
const report = {
  archived: 0,
  irrelevant: 0,
  duplicate: 0
};

for (const row of csvRows) {
  const offerId = sanitizeText(row.SKU);
  const externalId = sanitizeText(row["External ID"]);
  const merged = mergedByOfferId.get(offerId) ?? mergedByProductId.get(externalId);
  const description = pickDescription(row, merged) || sanitizeText(descriptionMap?.[externalId] || "");
  const combinedText = `${row.Category} ${row.Title} ${row.Description} ${row.Text} ${description}`;

  if (!isRelevantRecord(row, merged, combinedText)) {
    if (merged?.list_item?.archived) {
      report.archived += 1;
    } else {
      report.irrelevant += 1;
    }

    excluded.push({
      sku: offerId,
      category: row.Category,
      archived: Boolean(merged?.list_item?.archived),
      title: shorten(sanitizeText(row.Title), 90)
    });
    continue;
  }

  const characteristics = parseCharacteristics(row.Characteristics);
  const compatibility = extractCompatibility(description);
  const name = buildName(row, description);
  const mappedCategory = mapCategory(row.Category);
  const categoryLabel = baseCategories.find((item) => item.slug === mappedCategory)?.title ?? row.Category;
  const color = resolveColor(characteristics);
  const brand = resolveBrand(row, characteristics, compatibility, name);
  const images = collectImages(row, merged);
  const salesMode = buildSalesMode(merged);
  const fingerprint = [
    mappedCategory,
    name.toLowerCase(),
    brand.toLowerCase(),
    color.toLowerCase(),
    compatibility.toLowerCase(),
    images[0] ?? ""
  ].join("|");

  if (seenFingerprints.has(fingerprint)) {
    report.duplicate += 1;
    excluded.push({
      sku: offerId,
      category: row.Category,
      archived: false,
      title: shorten(name, 90)
    });
    continue;
  }

  seenFingerprints.add(fingerprint);

  const slugBase = slugify(`${name}-${offerId}`) || `product-${offerId.toLowerCase()}`;
  const marketplace = salesMode === "marketplace" ? buildMarketplace(row) : undefined;
  const important = extractImportant(description);

  products.push({
    slug: slugBase,
    sku: offerId,
    name,
    category: mappedCategory,
    categoryLabel,
    salesMode,
    availability: buildAvailability(merged),
    deliveryClass: "standard",
    pricing: buildPricing(salesMode),
    marketplace,
    compatibility,
    price: "",
    material: characteristics["материал"] || "",
    color,
    leadTime: "",
    images,
    shortDescription: buildShortDescription(name, description),
    description: shorten(description, 900),
    installation: extractInstallation(description),
    delivery: "",
    important,
    brand,
    model: characteristics["модель"] || ""
  });
}

products.sort((left, right) => {
  const categoryOrder = (categoryPriority[left.category] ?? 99) - (categoryPriority[right.category] ?? 99);

  if (categoryOrder !== 0) {
    return categoryOrder;
  }

  const imageOrder = Number(Boolean(right.images.length)) - Number(Boolean(left.images.length));

  if (imageOrder !== 0) {
    return imageOrder;
  }

  const availabilityOrder = Number(right.availability === "in_stock") - Number(left.availability === "in_stock");

  if (availabilityOrder !== 0) {
    return availabilityOrder;
  }

  return left.name.localeCompare(right.name, "ru");
});

const categoriesInUse = new Set(products.map((product) => product.category));
const categories = baseCategories.filter((category) => categoriesInUse.has(category.slug));

const fileContents = `import { Category, Product } from "@/types";

// Generated from Ozon exports in ./ozon_data by scripts/build-ozon-catalog.mjs.
// The file keeps only public-facing active products relevant to the site positioning.

export const categories: Category[] = ${serializeValue(categories, 0)};

export const products: Product[] = ${serializeValue(products, 0)};
`;

fs.writeFileSync(outputFile, fileContents, "utf8");

console.log(
  JSON.stringify(
    {
      categories: categories.length,
      products: products.length,
      excluded: excluded.length,
      report
    },
    null,
    2
  )
);
