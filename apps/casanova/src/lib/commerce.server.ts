import {
  CatalogError,
  createPublicCatalogClient,
} from "@echoray/api-client/public-catalog"
import type {
  PublicCard,
  PublicImage,
} from "@echoray/api-client/public-catalog"
import { getRequest } from "@tanstack/react-start/server"
import type {
  CatalogFilters,
  CatalogPage,
  ProductDetail,
  StoreCard,
  StoreImage,
} from "./commerce"

// The shop this site belongs to. Its address can change (Echoray Commerce → Website and domain),
// so only the business is checked, not the origin.
const expectedBusiness = "ks7b2qvhzs7ekqgbnavv1hedps8g6e7y"

function catalogClient() {
  const setting = (name: string, fallback: string) =>
    process.env[name]?.trim() || fallback
  return createPublicCatalogClient({
    gatewayUrl: setting(
      "STOREFRONT_GATEWAY_URL",
      "https://commerce.echoray.io"
    ),
    storefrontId: setting(
      "STOREFRONT_PUBLIC_INTEGRATION_ID",
      "p175bnas6hrc98w4gm8tbb94yx8g6sw1"
    ),
  })
}
type Client = ReturnType<typeof catalogClient>

async function bootstrap(client: Client, signal: AbortSignal) {
  const result = await client.bootstrap({ limit: 50 }, signal)
  if (result.data.shop.businessId !== expectedBusiness) {
    throw new Error("Casa Nova catalog scope mismatch")
  }
  return result
}

function image(value: PublicImage, client: Client): StoreImage {
  const candidates = [
    ...new Map(
      value.derivatives.map((d) => [
        d.width,
        `${client.imageUrl(value, d.preset)} ${d.width}w`,
      ])
    ).values(),
  ]
  return {
    src: client.imageUrl(value, "card"),
    detail: client.imageUrl(value, "detail"),
    srcSet: candidates.length ? candidates.join(", ") : undefined,
    width: value.width,
    height: value.height,
    alt: value.alt,
  }
}

function card(value: PublicCard, client: Client): StoreCard {
  return { ...value, images: value.images.map((i) => image(i, client)) }
}

function failure(error: unknown) {
  const code = error instanceof CatalogError ? error.code : "UNAVAILABLE"
  console.warn(JSON.stringify({ event: "casanova_catalog_unavailable", code }))
  return {
    restartPagination: error instanceof CatalogError && error.restartPagination,
    retryAfterSeconds:
      error instanceof CatalogError ? error.retryAfterSeconds : null,
  }
}

export async function readCatalogPage(
  filters: CatalogFilters
): Promise<CatalogPage> {
  try {
    const client = catalogClient()
    const signal = getRequest().signal
    const boot = await bootstrap(client, signal)
    const categories = [...boot.data.page]
    let cursor = boot.data.cursor
    let loadedAt = boot.diagnostics.loadedAt
    // Bound navigation to 1,000 categories; never silently truncate it.
    for (let page = 1; cursor && page < 20; page++) {
      const next = await client.collections({ limit: 50, cursor }, signal)
      categories.push(...next.data.page)
      cursor = next.data.cursor
      loadedAt = Math.min(loadedAt, next.diagnostics.loadedAt)
    }
    if (cursor) throw new Error("Category navigation exceeds supported size")
    if (
      filters.collection &&
      !categories.some((c) => c.name === filters.collection)
    ) {
      return {
        status: "ready",
        categories,
        products: [],
        cursor: null,
        loadedAt,
      }
    }
    const products = await client.products(
      {
        ...(filters.collection ? { collection: filters.collection } : {}),
        ...(filters.cursor ? { cursor: filters.cursor } : {}),
        limit: 24,
      },
      signal
    )
    return {
      status: "ready",
      categories,
      products: products.data.page.map((p) => card(p, client)),
      cursor: products.data.cursor,
      loadedAt: Math.min(loadedAt, products.diagnostics.loadedAt),
    }
  } catch (error) {
    return {
      status: "unavailable",
      categories: [],
      products: [],
      cursor: null,
      ...failure(error),
    }
  }
}

export async function readProductDetail(slug: string): Promise<ProductDetail> {
  try {
    const client = catalogClient()
    const signal = getRequest().signal
    const boot = await bootstrap(client, signal)
    const detail = await client.detail(slug, signal)
    const product = detail.data.product
    return {
      status: "ready",
      product: {
        ...card(product, client),
        images: (product.gallery.length ? product.gallery : product.images).map(
          (i) => image(i, client)
        ),
        description: product.description,
        specifications: product.specifications,
        features: product.page?.labels ?? [],
      },
      loadedAt: Math.min(
        boot.diagnostics.loadedAt,
        detail.diagnostics.loadedAt
      ),
    }
  } catch (error) {
    return {
      status:
        error instanceof CatalogError && error.code === "NOT_FOUND"
          ? "not-found"
          : "unavailable",
      product: null,
      ...failure(error),
    }
  }
}
