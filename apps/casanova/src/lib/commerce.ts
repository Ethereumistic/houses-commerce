import { createServerFn } from "@tanstack/react-start"
import type {
  PublicCard,
  CatalogResponse,
} from "@echoray/api-client/public-catalog"

export type StoreImage = {
  src: string
  detail: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
}
export type StoreCard = Omit<PublicCard, "images"> & { images: StoreImage[] }
export type StoreProduct = StoreCard & {
  description: string
  specifications: { label: string; value: string }[]
  features: string[]
}
export type CatalogPage = {
  status: "ready" | "unavailable"
  categories: CatalogResponse<"bootstrap">["data"]["page"]
  products: StoreCard[]
  cursor: string | null
  loadedAt?: number
  retryAfterSeconds?: number | null
  restartPagination?: boolean
}
export type ProductDetail = {
  status: "ready" | "not-found" | "unavailable"
  product: StoreProduct | null
  loadedAt?: number
  retryAfterSeconds?: number | null
}
export type CatalogFilters = { collection?: string; cursor?: string }

export function validateCatalogFilters(value: unknown): CatalogFilters {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const input = value as Record<string, unknown>
  const hasControlCharacters = (text: string) =>
    Array.from(text).some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
    )
  return {
    collection:
      typeof input.collection === "string" &&
      input.collection.length <= 120 &&
      !hasControlCharacters(input.collection)
        ? input.collection || undefined
        : undefined,
    cursor:
      typeof input.cursor === "string" &&
      input.cursor.length <= 4096 &&
      !hasControlCharacters(input.cursor)
        ? input.cursor || undefined
        : undefined,
  }
}

export const getCatalogPage = createServerFn({ method: "GET" })
  .validator(validateCatalogFilters)
  .handler(async ({ data }): Promise<CatalogPage> => {
    const { readCatalogPage } = await import("./commerce.server")
    return readCatalogPage(data)
  })

export const getProductDetail = createServerFn({ method: "GET" })
  .validator((slug: unknown) => {
    if (
      typeof slug !== "string" ||
      !/^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(slug)
    ) {
      throw new Error("Invalid product slug")
    }
    return slug
  })
  .handler(async ({ data }): Promise<ProductDetail> => {
    const { readProductDetail } = await import("./commerce.server")
    return readProductDetail(data)
  })

export function inquiryForProduct(product: StoreCard) {
  return `mailto:office@casanovaltd.com?subject=${encodeURIComponent(`Запитване за Casanova ${product.name}`)}`
}

export function productPrice(product: StoreCard) {
  return product.minAmount === 0
    ? "Цена по запитване"
    : `от ${new Intl.NumberFormat("bg-BG", { style: "currency", currency: product.currency }).format(product.minAmount / 100)}`
}
