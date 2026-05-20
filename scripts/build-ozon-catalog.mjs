import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "ozon_data");
const outputFile = path.join(rootDir, "data", "ozon-catalog.ts");
const dryRun = process.argv.includes("--dry-run");

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

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath, fallback = undefined) {
  if (!fileExists(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function detectCsvDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;

  return commaCount > semicolonCount ? "," : ";";
}

function parseCsv(text) {
  const delimiter = detectCsvDelimiter(text);
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

    if (char === delimiter) {
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

  return {
    delimiter,
    rows: records
      .filter((record) => record.some((cell) => cell && cell.trim()))
      .map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])))
  };
}

function readCsvFile(filePath) {
  if (!fileExists(filePath)) {
    return { delimiter: ",", rows: [] };
  }

  return parseCsv(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.result?.items)) {
    return value.result.items;
  }

  return [];
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

function normalizeNumber(value) {
  const numeric = Number(String(value ?? "").replace(",", ".").replace(/[^0-9.-]/g, ""));

  return Number.isFinite(numeric) ? numeric : 0;
}

function parsePythonishObject(value) {
  const text = String(value ?? "").trim();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(
      text
        .replace(/'/g, '"')
        .replace(/\bNone\b/g, "null")
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
    );
  } catch {
    return undefined;
  }
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
    ...(Array.isArray(merged?.pictures?.photo) ? merged.pictures.photo : []),
    merged?.primary_image,
    ...(Array.isArray(merged?.images) ? merged.images : [])
  ]);

  return unique([...apiImages, ...csvImages]).filter((image) => /^https?:\/\//i.test(image));
}

function pickDescription(row, merged, existingProduct) {
  return sanitizeText(merged?.description || row.Text || row.Description || existingProduct?.description || "");
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
  let name = sanitizeText(row.Title || row.name || row.Description || description);

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
  if (!description) {
    return name;
  }

  const sentence = description.split(/(?<=[.!?])\s+/)[0]?.trim() || description;
  return shorten(sentence, 220);
}

function inferCategoryName(text) {
  if (/\b(молдинг|накладк|кузов|бампер|арок|крыл|порог|решетк)\b/i.test(text)) {
    return "Накладки и молдинги";
  }

  if (/\b(панел|консол|воздуховод|дефлектор|торпед|рамк)\b/i.test(text)) {
    return "Центральные консоли и рамки";
  }

  if (/\b(салон|подстакан|подлокот|эмблем|декор|крышк)\b/i.test(text)) {
    return "Элементы салона";
  }

  if (/\b(креплен|клипс|заглуш|держател|фиксатор)\b/i.test(text)) {
    return "Крепления и клипсы";
  }

  return "Прочее";
}

function isRelevantRecord(row, merged, combinedText) {
  if (!merged || merged.list_item?.archived || merged.is_archived) {
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
  return merged?.list_item?.has_fbo_stocks || merged?.list_item?.has_fbs_stocks || merged?.hasStocks ? "marketplace" : "inquiry";
}

function buildAvailability(merged) {
  if (merged?.list_item?.archived || merged?.is_archived) {
    return "out_of_stock";
  }

  return merged?.list_item?.has_fbo_stocks || merged?.list_item?.has_fbs_stocks || merged?.hasStocks ? "in_stock" : "on_request";
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

function resolveBrand(row, characteristics, compatibility, name, existingProduct) {
  const explicitBrand = sanitizeText(row.Brand) || characteristics["марка"];
  const inferredBrand = brandPattern.exec(`${compatibility} ${name}`)?.[0] ?? "";

  return explicitBrand || inferredBrand || existingProduct?.brand || "";
}

function resolveColor(characteristics, existingProduct) {
  const color = characteristics["цвет"] || existingProduct?.color || "";

  if (!color || color.length > 60) {
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

function loadExistingProducts() {
  if (!fileExists(outputFile)) {
    return [];
  }

  try {
    let text = fs.readFileSync(outputFile, "utf8");
    text = text.replace(/^import[^\n]+\n/gm, "");
    text = text.replace(/export const categories[^=]*=\s*/, "globalThis.categories = ");
    text = text.replace(/export const products[^=]*=\s*/, "globalThis.products = ");

    const context = { globalThis: {} };
    vm.createContext(context);
    vm.runInContext(text, context, { filename: outputFile });

    return Array.isArray(context.globalThis.products) ? context.globalThis.products : [];
  } catch {
    return [];
  }
}

function getCurrentOfferIds() {
  return new Set(loadExistingProducts().map((product) => product.sku).filter(Boolean));
}

function getRecordValue(row, key) {
  return sanitizeText(row?.[key]);
}

function buildProductFromNormalized({ row, merged, existingProduct, report }) {
  const offerId = getRecordValue(row, "SKU") || getRecordValue(row, "offer_id");
  const description = pickDescription(row, merged, existingProduct);
  const combinedText = `${row.Category} ${row.Title} ${row.Description} ${row.Text} ${description} ${row.name}`;

  if (!isRelevantRecord(row, merged, combinedText)) {
    if (merged?.list_item?.archived || merged?.is_archived) {
      report.archived += 1;
    } else {
      report.irrelevant += 1;
    }

    return undefined;
  }

  const characteristics = parseCharacteristics(row.Characteristics);
  const compatibility = extractCompatibility(description) || existingProduct?.compatibility || "";
  const name = buildName(row, description) || existingProduct?.name || offerId;
  const mappedCategory = mapCategory(row.Category);
  const categoryLabel = baseCategories.find((item) => item.slug === mappedCategory)?.title ?? row.Category;
  const color = resolveColor(characteristics, existingProduct);
  const brand = resolveBrand(row, characteristics, compatibility, name, existingProduct);
  const images = collectImages(row, merged);
  const salesMode = buildSalesMode(merged);
  const marketplace = salesMode === "marketplace" ? buildMarketplace() : undefined;
  const important = extractImportant(description) || existingProduct?.important || "";
  const slugBase = existingProduct?.slug || slugify(`${name}-${offerId}`) || `product-${offerId.toLowerCase()}`;

  return {
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
    material: characteristics["материал"] || existingProduct?.material || "",
    color,
    leadTime: "",
    images,
    shortDescription: buildShortDescription(name, description),
    description: shorten(description, 900),
    installation: extractInstallation(description) || existingProduct?.installation || "",
    delivery: "",
    important,
    brand,
    model: characteristics["модель"] || existingProduct?.model || ""
  };
}

function buildProductsFromRows(rows, mergedByOfferId, mergedByProductId, existingByOfferId) {
  const seenFingerprints = new Set();
  const products = [];
  const report = {
    archived: 0,
    irrelevant: 0,
    duplicate: 0
  };

  for (const row of rows) {
    const offerId = getRecordValue(row, "SKU") || getRecordValue(row, "offer_id");
    const externalId = getRecordValue(row, "External ID") || getRecordValue(row, "product_id");
    const merged = mergedByOfferId.get(offerId) ?? mergedByProductId.get(externalId);
    const existingProduct = existingByOfferId.get(offerId);
    const product = buildProductFromNormalized({ row, merged, existingProduct, report });

    if (!product) {
      continue;
    }

    const fingerprint = [
      product.category,
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.color.toLowerCase(),
      product.compatibility.toLowerCase(),
      product.images[0] ?? ""
    ].join("|");

    if (seenFingerprints.has(fingerprint)) {
      report.duplicate += 1;
      continue;
    }

    seenFingerprints.add(fingerprint);
    products.push(product);
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

  return { products, report };
}

function readLegacyExport(existingByOfferId) {
  const mergedProducts = readJson(path.join(sourceDir, "products_full.fixed.json"), []);
  const descriptionMap = readJson(path.join(sourceDir, "product_descriptions_raw.fixed.json"), {});
  const csv = readCsvFile(path.join(sourceDir, "tilda_import.csv"));

  const mergedByOfferId = new Map(mergedProducts.map((item) => [String(item.offer_id || ""), item]));
  const mergedByProductId = new Map(mergedProducts.map((item) => [String(item.product_id || ""), item]));
  const rows = csv.rows.map((row) => {
    const externalId = sanitizeText(row["External ID"]);
    return {
      ...row,
      Text: row.Text || sanitizeText(descriptionMap?.[externalId] || "")
    };
  });

  return {
    format: "legacy",
    csvDelimiter: csv.delimiter,
    rows,
    mergedByOfferId,
    mergedByProductId,
    sourceOfferIds: new Set(rows.map((row) => sanitizeText(row.SKU)).filter(Boolean)),
    totalExportItems: rows.length,
    archivedExportItems: mergedProducts.filter((item) => item?.list_item?.archived).length,
    withImages: mergedProducts.filter((item) => collectImages({}, item).length > 0).length,
    withPrices: 0,
    withStocks: mergedProducts.filter((item) => item?.list_item?.has_fbo_stocks || item?.list_item?.has_fbs_stocks).length,
    existingByOfferId
  };
}

function getStockCount(row) {
  const stocks = parsePythonishObject(row?.stocks);

  if (!Array.isArray(stocks)) {
    return 0;
  }

  return stocks.reduce((total, item) => total + normalizeNumber(item?.present), 0);
}

function readNewExport(existingByOfferId) {
  const detailsCsv = readCsvFile(path.join(sourceDir, "csv", "product_details_flat.csv"));
  const listCsv = readCsvFile(path.join(sourceDir, "csv", "product_list.csv"));
  const stocksCsv = readCsvFile(path.join(sourceDir, "csv", "stocks.csv"));
  const pricesCsv = readCsvFile(path.join(sourceDir, "csv", "prices.csv"));
  const rawDetails = asArray(readJson(path.join(sourceDir, "raw", "product_details.json"), []));

  const detailsByOfferId = new Map(detailsCsv.rows.map((row) => [sanitizeText(row.offer_id), row]).filter(([offerId]) => offerId));
  const listByOfferId = new Map(listCsv.rows.map((row) => [sanitizeText(row.offer_id), row]).filter(([offerId]) => offerId));
  const stocksByOfferId = new Map(stocksCsv.rows.map((row) => [sanitizeText(row.offer_id), row]).filter(([offerId]) => offerId));
  const pricesByOfferId = new Map(pricesCsv.rows.map((row) => [sanitizeText(row.offer_id), row]).filter(([offerId]) => offerId));
  const rawDetailsByOfferId = new Map(rawDetails.map((item) => [sanitizeText(item.offer_id), item]).filter(([offerId]) => offerId));
  const sourceOfferIds = new Set([
    ...detailsByOfferId.keys(),
    ...listByOfferId.keys(),
    ...stocksByOfferId.keys(),
    ...pricesByOfferId.keys(),
    ...rawDetailsByOfferId.keys()
  ]);

  const rows = [...sourceOfferIds].map((offerId) => {
    const details = detailsByOfferId.get(offerId) ?? {};
    const rawDetailsItem = rawDetailsByOfferId.get(offerId) ?? {};
    const existingProduct = existingByOfferId.get(offerId);
    const title = sanitizeText(details.name || rawDetailsItem.name || existingProduct?.name || offerId);
    const existingCategoryLabel = existingProduct?.categoryLabel;
    const category = existingCategoryLabel && Object.values(categoryMap).includes(existingProduct?.category)
      ? Object.entries(categoryMap).find(([, slug]) => slug === existingProduct.category)?.[0]
      : inferCategoryName(`${title} ${existingProduct?.description || ""}`);

    return {
      SKU: offerId,
      "External ID": sanitizeText(details.product_id || rawDetailsItem.id),
      Title: title,
      Description: existingProduct?.description || "",
      Text: existingProduct?.description || "",
      Category: category,
      Characteristics: "",
      Brand: existingProduct?.brand || "",
      name: title
    };
  });

  const mergedByOfferId = new Map(
    [...sourceOfferIds].map((offerId) => {
      const details = detailsByOfferId.get(offerId) ?? {};
      const listItem = listByOfferId.get(offerId) ?? {};
      const rawDetailsItem = rawDetailsByOfferId.get(offerId) ?? {};
      const stockRow = stocksByOfferId.get(offerId);
      const hasStocks = getStockCount(stockRow) > 0 || /^true$/i.test(String(listItem.has_fbo_stocks)) || /^true$/i.test(String(listItem.has_fbs_stocks));
      const archived = /^true$/i.test(String(listItem.archived)) || Boolean(rawDetailsItem.is_archived);

      return [
        offerId,
        {
          offer_id: offerId,
          product_id: sanitizeText(details.product_id || rawDetailsItem.id),
          name: sanitizeText(details.name || rawDetailsItem.name),
          price: sanitizeText(details.price || rawDetailsItem.price),
          old_price: sanitizeText(details.old_price || rawDetailsItem.old_price),
          primary_image: sanitizeText(rawDetailsItem.primary_image),
          images: Array.isArray(rawDetailsItem.images) ? rawDetailsItem.images.filter((image) => /^https?:\/\//i.test(String(image))) : [],
          hasStocks,
          is_archived: archived,
          updated_at: sanitizeText(details.updated_at || rawDetailsItem.updated_at),
          status_name: sanitizeText(details.status_name || rawDetailsItem.statuses?.status_name),
          list_item: {
            archived,
            has_fbo_stocks: /^true$/i.test(String(listItem.has_fbo_stocks)) || hasStocks,
            has_fbs_stocks: /^true$/i.test(String(listItem.has_fbs_stocks))
          }
        }
      ];
    })
  );

  const mergedByProductId = new Map([...mergedByOfferId.values()].map((item) => [String(item.product_id || ""), item]).filter(([productId]) => productId));

  return {
    format: "new",
    csvDelimiter: detailsCsv.delimiter,
    rows,
    mergedByOfferId,
    mergedByProductId,
    sourceOfferIds,
    totalExportItems: sourceOfferIds.size,
    archivedExportItems: [...mergedByOfferId.values()].filter((item) => item.is_archived).length,
    withImages: [...mergedByOfferId.values()].filter((item) => collectImages({}, item).length > 0).length,
    withPrices: [...mergedByOfferId.values()].filter((item) => normalizeNumber(item.price) > 0).length,
    withStocks: [...sourceOfferIds].filter((offerId) => stocksByOfferId.has(offerId)).length,
    existingByOfferId
  };
}

function getExportData(existingByOfferId) {
  if (fileExists(path.join(sourceDir, "csv", "product_details_flat.csv"))) {
    return readNewExport(existingByOfferId);
  }

  return readLegacyExport(existingByOfferId);
}

function buildFileContents(categories, products) {
  return `import { Category, Product } from "@/types";

// Generated from Ozon exports in ./ozon_data by scripts/build-ozon-catalog.mjs.
// The file keeps only public-facing active products relevant to the site positioning.

export const categories: Category[] = ${serializeValue(categories, 0)};

export const products: Product[] = ${serializeValue(products, 0)};
`;
}

const existingProducts = loadExistingProducts();
const existingByOfferId = new Map(existingProducts.map((product) => [product.sku, product]));
const currentOfferIds = getCurrentOfferIds();
const exportData = getExportData(existingByOfferId);
const { products, report } = buildProductsFromRows(exportData.rows, exportData.mergedByOfferId, exportData.mergedByProductId, existingByOfferId);
const categoriesInUse = new Set(products.map((product) => product.category));
const categories = baseCategories.filter((category) => categoriesInUse.has(category.slug));
const newOfferIds = [...exportData.sourceOfferIds].filter((offerId) => !currentOfferIds.has(offerId));
const missingOfferIds = [...currentOfferIds].filter((offerId) => !exportData.sourceOfferIds.has(offerId));
const summary = {
  mode: dryRun ? "dry-run" : "write",
  format: exportData.format,
  csvDelimiter: exportData.csvDelimiter,
  exportItems: exportData.totalExportItems,
  generatedProducts: products.length,
  categories: categories.length,
  archived: exportData.archivedExportItems,
  withImages: exportData.withImages,
  withPrices: exportData.withPrices,
  withStockRows: exportData.withStocks,
  newOfferIds: newOfferIds.length,
  missingOfferIds: missingOfferIds.length,
  newOfferIdSamples: newOfferIds.slice(0, 20),
  missingOfferIdSamples: missingOfferIds.slice(0, 20),
  report
};

if (!dryRun) {
  fs.writeFileSync(outputFile, buildFileContents(categories, products), "utf8");
}

console.log(JSON.stringify(summary, null, 2));
