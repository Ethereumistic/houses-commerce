const METRES_PER_FOOT = 0.3048

export type House = {
  id: string
  name: string
  category: "timber" | "steel"
  referenceFeet: readonly [number, number]
  sourceUrl: string
  bedrooms: number
  bathrooms: number
  description: string
  features: readonly string[]
}

// Reference footprints exclude decks and stairs. Round each converted side up
// to whole metres, as requested; these are proposed Casanova catalog dimensions.
export function footprint(house: House) {
  const [lengthFeet, widthFeet] = house.referenceFeet
  const length = Math.ceil(lengthFeet * METRES_PER_FOOT)
  const width = Math.ceil(widthFeet * METRES_PER_FOOT)
  return { length, width, area: length * width }
}

export const houses: readonly House[] = [
  {
    id: "studio",
    name: "Студио",
    category: "timber",
    referenceFeet: [29, 15],
    sourceUrl: "https://www.samara.com/adus/studio",
    bedrooms: 0,
    bathrooms: 1,
    description:
      "Лично пространство за бавни уикенди, творчески идеи или гости. Компактен дом с отворена дневна, място за спане и всичко необходимо за ежедневието.",
    features: [
      "Отворена дневна с кухненска зона",
      "Обособено място за спане",
      "Една баня",
      "Дървена конструкция",
    ],
  },
  {
    id: "one-bedroom",
    name: "Една спалня",
    category: "timber",
    referenceFeet: [37, 15],
    sourceUrl: "https://www.samara.com/adus/one-bedroom",
    bedrooms: 1,
    bathrooms: 1,
    description:
      "Достатъчно простор за двама и достатъчно уют за всеки ден. Самостоятелна спалня, светла дневна и кухня, отворена към градината.",
    features: [
      "Самостоятелна спалня",
      "Дневна с кухненска зона",
      "Една баня",
      "Дървена конструкция",
    ],
  },
  {
    id: "two-bedroom",
    name: "Две спални",
    category: "steel",
    referenceFeet: [47, 15],
    sourceUrl: "https://www.samara.com/adus/two-bedroom",
    bedrooms: 2,
    bathrooms: 1,
    description:
      "Място за семейството, за приятелите или за кабинет с гледка. Издълженият план съчетава две отделни спални със споделена дневна.",
    features: [
      "Две самостоятелни спални",
      "Дневна с кухненска зона",
      "Една баня",
      "Метална конструкция",
    ],
  },
  {
    id: "xl-8",
    name: "XL 8",
    category: "steel",
    referenceFeet: [32, 25],
    sourceUrl: "https://www.samara.com/adus/xl-8",
    bedrooms: 2,
    bathrooms: 2,
    description:
      "Повече свобода в компактен силует. Две спални и две бани дават лично пространство на всеки, а дневната събира всички заедно.",
    features: [
      "Две самостоятелни спални",
      "Две бани",
      "Просторна дневна с кухня",
      "Метална конструкция",
    ],
  },
  {
    id: "xl-9",
    name: "XL 9",
    category: "steel",
    referenceFeet: [35, 25],
    sourceUrl: "https://www.samara.com/adus/xl-9",
    bedrooms: 2,
    bathrooms: 2,
    description:
      "Дом, в който има място да останете. По-широка дневна, две спални и удобни зони за съхранение, с естествена връзка към двора.",
    features: [
      "Две самостоятелни спални",
      "Две бани",
      "Дневна с място за трапезария",
      "Метална конструкция",
    ],
  },
  {
    id: "xl-10",
    name: "XL 10",
    category: "steel",
    referenceFeet: [38, 25],
    sourceUrl: "https://www.samara.com/adus/xl-10",
    bedrooms: 2,
    bathrooms: 2,
    description:
      "Нашият най-просторен модел. Две спални, две бани и щедра дневна с кухня — за спокойните сутрини и големите семейни вечери.",
    features: [
      "Две просторни спални",
      "Две бани",
      "Голяма дневна с кухня и трапезария",
      "Метална конструкция",
    ],
  },
]

export const categoryLabels = {
  timber: "Дървена конструкция",
  steel: "Метална конструкция",
}

export const contact = {
  phone: "0877 067 676",
  phoneHref: "tel:+359877067676",
  email: "office@casanovaltd.com",
}

export function inquiryHref(house?: House) {
  const subject = house
    ? `Запитване за Casanova ${house.name}`
    : "Запитване за дом от Casanova"
  const body = house
    ? `Здравейте,\n\nИнтересувам се от модела ${house.name} (${footprint(house).length} × ${footprint(house).width} м).\n\nМестоположение на имота:\nПредпочитан срок:\nТелефон за връзка:\n\nБлагодаря!`
    : "Здравейте,\n\nБих искал/а да обсъдим проект за къща.\n\nМестоположение на имота:\nПредпочитан модел:\nТелефон за връзка:\n\nБлагодаря!"
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
