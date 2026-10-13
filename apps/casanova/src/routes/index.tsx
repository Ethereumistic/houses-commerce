import { useCallback, useEffect, useRef, useState } from "react"
import {
  createFileRoute,
  useRouter,
  useRouterState,
} from "@tanstack/react-router"
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  Menu,
  Phone,
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonLink } from "@workspace/ui/components/button-link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  contact,
  footprint,
  houses as houseReferences,
  inquiryHref,
} from "../data/houses"
import { useFreshnessRefresh } from "@workspace/ui/hooks/use-freshness-refresh"
import {
  getCatalogPage,
  getProductDetail,
  inquiryForProduct,
  productPrice,
  validateCatalogFilters,
} from "../lib/commerce"
import type { ProductDetail, StoreCard, StoreImage } from "../lib/commerce"

export const Route = createFileRoute("/")({
  validateSearch: validateCatalogFilters,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getCatalogPage({ data: deps }),
  staleTime: 0,
  preloadStaleTime: 0,
  component: Homepage,
})

const navigation = [
  { href: "#houses", label: "Нашите къщи" },
  { href: "#craft", label: "Как строим" },
  { href: "#questions", label: "Въпроси" },
]

const questions = [
  {
    title: "Дървена или метална конструкция?",
    answer:
      "Студио и моделът с една спалня са предложения с дървена конструкция. Две спални и серията XL са с метална конструкция. Изборът зависи от терена, начина на ползване и вашите предпочитания. Ще обсъдим подходящото решение заедно.",
  },
  {
    title: "Мога ли да променя разпределението и материалите?",
    answer:
      "Да. Моделите са отправна точка за вашия индивидуален проект. Разпределението, фасадата, остъкляването и интериорът се обсъждат с екипа ни според нуждите ви и възможностите на имота.",
  },
  {
    title: "Какво означават показаните размери?",
    answer:
      "Размерите са ориентировъчни габарити, закръглени нагоре до цели метри. Показаната площ е произведението на тези габарити, а не чиста жилищна площ. Тераси, стъпала и необходимите отстояния не са включени. Точните размери се определят в индивидуалния проект.",
  },
  {
    title: "Как се определят цената и срокът?",
    answer:
      "Изготвяме индивидуална оферта според избрания модел, довършителните работи, терена и достъпа до него. След като обсъдим проекта, ще уточним бюджета, етапите и срока за изпълнение.",
  },
  {
    title: "Може ли домът да включва смарт решения?",
    answer:
      "Предлагаме консултация за система „Умен дом“ iNELS. Осветление, управление и други функции могат да бъдат включени в индивидуалния проект според вашите нужди.",
  },
]

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand${footer ? "brand-footer" : ""}`}
      href="#top"
      aria-label="Casanova — начало"
    >
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path
          d="M3 20 18 5l15 15M7 16v15h22V16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        casanova<span className="brand-period">.</span>
      </span>
    </a>
  )
}

function HouseImage({
  id,
  alt,
  hero = false,
  className = "",
}: {
  id: string
  alt: string
  hero?: boolean
  className?: string
}) {
  return (
    <img
      className={className}
      src={`/images/${id}.webp`}
      srcSet={`/images/${id}-800.webp 800w, /images/${id}.webp 1672w`}
      sizes={
        hero
          ? "100vw"
          : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
      }
      width={1672}
      height={941}
      alt={alt}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
      decoding="async"
    />
  )
}

function CatalogImage({
  image,
  name,
  detail = false,
}: {
  image?: StoreImage
  name: string
  detail?: boolean
}) {
  if (!image) return <div className="house-image-placeholder">{name}</div>
  return (
    <img
      src={detail ? image.detail : image.src}
      srcSet={image.srcSet}
      sizes={
        detail
          ? "(max-width: 640px) 100vw, 900px"
          : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
      }
      width={image.width || 1672}
      height={image.height || 941}
      alt={image.alt || `Casanova ${name} — концептуална визуализация`}
      loading={detail ? "eager" : "lazy"}
      decoding="async"
    />
  )
}

function HouseCard({
  house,
  onSelect,
}: {
  house: StoreCard
  onSelect: (house: StoreCard) => void
}) {
  // Reference geometry stays in houses.ts; membership, names and photos come from Commerce.
  const reference = houseReferences.find((model) => model.id === house.slug)
  const size = reference ? footprint(reference) : null
  return (
    <article className="house-card">
      <Button
        className="house-image-button"
        variant="ghost"
        onClick={() => onSelect(house)}
        aria-label={`Разгледайте ${house.name}`}
      >
        <CatalogImage image={house.images[0]} name={house.name} />
        <span className="house-image-action">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </Button>
      <div className="house-card-heading">
        <h3>{house.name}</h3>
        {size && (
          <span>
            {size.length} × {size.width} м
          </span>
        )}
      </div>
      <p className="house-category">{house.collection}</p>
      {reference && (
        <div className="house-card-bottom">
          <div className="house-room-list">
            <span>
              <BedDouble aria-hidden="true" />
              {reference.bedrooms === 0
                ? "Студио"
                : `${reference.bedrooms} ${reference.bedrooms === 1 ? "спалня" : "спални"}`}
            </span>
            <span>
              <Bath aria-hidden="true" />
              {reference.bathrooms}{" "}
              {reference.bathrooms === 1 ? "баня" : "бани"}
            </span>
          </div>
          {size && <span className="house-area">{size.area} м²</span>}
        </div>
      )}
      <div className="house-card-bottom">
        <span className="house-price">{productPrice(house)}</span>
        <Button
          variant="ghost"
          onClick={() => onSelect(house)}
          aria-label={`Подробности за ${house.name}`}
        >
          Подробности <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}

function HouseDetails({ house }: { house: StoreCard }) {
  const [detail, setDetail] = useState<ProductDetail | null>(null)
  const request = useRef<AbortController | null>(null)
  const load = useCallback(async () => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setDetail(null)
    try {
      const result = await getProductDetail({
        data: house.slug,
        signal: controller.signal,
      })
      if (!controller.signal.aborted) setDetail(result)
    } catch {
      if (!controller.signal.aborted)
        setDetail({ status: "unavailable", product: null })
    }
  }, [house.slug])
  useEffect(() => {
    void load()
    return () => request.current?.abort()
  }, [load])
  useFreshnessRefresh(detail?.loadedAt, 30_000, load)
  const product = detail?.product
  return (
    <>
      {product && (
        <div className="detail-image">
          <CatalogImage image={product.images[0]} name={product.name} detail />
        </div>
      )}
      <div className="detail-body">
        <p className="detail-category">
          {product?.collection || house.collection}
        </p>
        <DialogTitle className="detail-title">
          Casanova {product?.name || house.name}
        </DialogTitle>
        <DialogDescription className="detail-description">
          {product
            ? product.description
            : !detail
              ? "Зареждаме подробностите за модела…"
              : detail.status === "not-found"
                ? "Този модел вече не е в каталога."
                : "Подробностите временно не са достъпни. Опитайте отново."}
        </DialogDescription>
        {detail?.status === "unavailable" && !detail.retryAfterSeconds && (
          <Button variant="outline" onClick={() => void load()}>
            Опитайте отново
          </Button>
        )}
        {product && (
          <>
            <dl className="detail-specs">
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="detail-features">
              {product.features.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="detail-note">{productPrice(product)}</p>
            <ButtonLink
              className="brand-button detail-inquiry"
              href={inquiryForProduct(product)}
            >
              Изпратете запитване
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </>
        )}
      </div>
      <DialogClose
        className="detail-close"
        render={
          <Button
            variant="secondary"
            size="icon"
            aria-label="Затворете подробностите"
          />
        }
      >
        <X aria-hidden="true" />
      </DialogClose>
    </>
  )
}

function Homepage() {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [selectedHouse, setSelectedHouse] = useState<StoreCard | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const catalog = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const pending = useRouterState({ select: (state) => state.isLoading })
  const selectedCategory = search.collection || "all"
  const featuredHouse = catalog.products.find(
    (product) => product.slug === "xl-10"
  )
  useFreshnessRefresh(catalog.loadedAt, 30_000, () => router.invalidate())
  const selectCategory = (value: unknown) => {
    if (typeof value !== "string") return
    void navigate({
      search: value === "all" ? {} : { collection: value },
      resetScroll: false,
    })
  }
  return (
    <div className="casanova-site" id="top">
      <a className="skip-link" href="#main">
        Към основното съдържание
      </a>
      <header className="site-header">
        <Brand />
        <nav className="desktop-navigation" aria-label="Основна навигация">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ButtonLink className="brand-button header-contact" href="#contact">
            Да поговорим
            <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="mobile-menu-trigger"
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Отворете менюто"
                />
              }
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent className="mobile-menu" showCloseButton={false}>
              <SheetTitle>casanova.</SheetTitle>
              <SheetDescription>Домът започва с вашата мечта.</SheetDescription>
              <SheetClose
                className="mobile-menu-close"
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Затворете менюто"
                  />
                }
              >
                <X aria-hidden="true" />
              </SheetClose>
              <nav aria-label="Мобилна навигация">
                {[
                  ...navigation,
                  { href: "#contact", label: "Да поговорим" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <a className="mobile-phone" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <HouseImage
            id="hero"
            alt="Съвременна къща Casanova с дървена фасада, големи прозорци и тераса сред зелените хълмове"
            hero
            className="hero-image"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p>Домът започва с вашата мечта.</p>
            <h1 id="hero-title">
              Малък дом.
              <br />
              Голямо начало.
            </h1>
            <ButtonLink className="hero-button" href="#houses">
              Разгледайте къщите
              <ArrowDown aria-hidden="true" />
            </ButtonLink>
          </div>
          {featuredHouse && (
            <Button
              className="hero-feature"
              variant="ghost"
              onClick={() => setSelectedHouse(featuredHouse)}
            >
              <span>
                <span className="hero-feature-name">
                  Casanova {featuredHouse.name}
                </span>
                <span className="hero-feature-dimensions">
                  Разгледайте модела
                </span>
              </span>
              <span className="hero-feature-icon">
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Button>
          )}
        </section>

        <section
          className="introduction section-wrap"
          aria-labelledby="intro-title"
        >
          <h2 id="intro-title">
            По-малко излишно.
            <br />
            Повече ваше.
          </h2>
          <div>
            <p>
              Сутрешно кафе на верандата. Светлина във всяка стая. Място за
              хората, които обичате. Създаваме дървени и метални къщи, в които
              добрият дизайн се усеща всеки ден.
            </p>
            <p className="intro-secondary">
              От първата идея до последния детайл — с индивидуален проект и
              внимание към вашия начин на живот.
            </p>
          </div>
        </section>

        <section
          className="catalog section-wrap"
          id="houses"
          aria-labelledby="catalog-title"
        >
          <div className="section-heading">
            <h2 id="catalog-title">Намерете вашия дом.</h2>
            <p>
              Различни модели. Различни възможности.
              <br />
              Една отправна точка — вие.
            </p>
          </div>
          <Tabs
            value={selectedCategory}
            onValueChange={selectCategory}
            className="catalog-tabs"
          >
            <TabsList
              className="catalog-filters"
              aria-label="Филтър по конструкция"
            >
              <TabsTrigger value="all">Всички къщи</TabsTrigger>
              {catalog.categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {[
              ...new Set([
                "all",
                ...catalog.categories.map((category) => category.name),
                selectedCategory,
              ]),
            ].map((category) => (
              <TabsContent key={category} value={category}>
                <div aria-busy={pending}>
                  {pending && (
                    <p role="status" className="catalog-status">
                      Зареждаме моделите…
                    </p>
                  )}
                  {catalog.status === "unavailable" ? (
                    <div className="catalog-status" role="alert">
                      <p>
                        Каталогът временно не е достъпен. Опитайте отново или се
                        свържете с нас.
                      </p>
                      {catalog.restartPagination ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            void navigate({
                              search: { collection: search.collection },
                              resetScroll: false,
                            })
                          }
                        >
                          Първа страница
                        </Button>
                      ) : (
                        !catalog.retryAfterSeconds && (
                          <Button
                            variant="outline"
                            onClick={() => void router.invalidate()}
                          >
                            Опитайте отново
                          </Button>
                        )
                      )}
                    </div>
                  ) : !catalog.products.length ? (
                    <p className="catalog-status">
                      Все още няма публикувани модели в тази категория.
                    </p>
                  ) : (
                    <div className="house-grid">
                      {catalog.products.map((house) => (
                        <HouseCard
                          key={house.id}
                          house={house}
                          onSelect={setSelectedHouse}
                        />
                      ))}
                    </div>
                  )}
                  <div className="catalog-pagination">
                    {search.cursor && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          void navigate({
                            search: { collection: search.collection },
                            resetScroll: false,
                          })
                        }
                      >
                        Първа страница
                      </Button>
                    )}
                    {catalog.cursor && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          void navigate({
                            search: {
                              collection: search.collection,
                              cursor: catalog.cursor || undefined,
                            },
                            resetScroll: false,
                          })
                        }
                      >
                        Следващи модели
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <p className="catalog-note">
            Площите са габаритни, изчислени от размерите, закръглени нагоре до
            цели метри. Терасите не са включени. Изображенията са концептуални
            визуализации.
          </p>
        </section>

        <section
          className="craft-section"
          id="craft"
          aria-labelledby="craft-title"
        >
          <div className="craft-image">
            <HouseImage
              id="one-bedroom"
              alt="Естествена дървена фасада и остъклена дневна, отворена към градината"
            />
          </div>
          <div className="craft-copy">
            <h2 id="craft-title">
              Добре обмислен.
              <br />
              Добре построен.
            </h2>
            <p>
              Естественото дърво носи топлина. Металната конструкция дава
              свобода на проекта. Избираме материалите според дома, който искате
              да създадем.
            </p>
            <div className="craft-point">
              <h3>Вашият дом, вашият почерк.</h3>
              <p>
                Разпределение, фасада и интериор, съобразени с вас и мястото.
              </p>
            </div>
            <div className="craft-point">
              <h3>Отворен към природата.</h3>
              <p>
                Светли пространства, големи прозорци и естествена връзка с
                двора.
              </p>
            </div>
            <ButtonLink
              className="craft-button"
              variant="outline"
              href="#contact"
            >
              Обсъдете вашия проект
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </section>

        <section
          className="process section-wrap"
          aria-labelledby="process-title"
        >
          <div className="section-heading">
            <h2 id="process-title">От идея до ключ.</h2>
            <p>Заедно, стъпка по стъпка.</p>
          </div>
          <ol className="process-steps">
            <li>
              <span className="step-number">1</span>
              <h3>Да се запознаем.</h3>
              <p>Разкажете ни за вашия имот, желанията и начина ви на живот.</p>
            </li>
            <li>
              <span className="step-number">2</span>
              <h3>Да го проектираме.</h3>
              <p>
                Избираме модел и уточняваме разпределението, материалите и
                бюджета.
              </p>
            </li>
            <li>
              <span className="step-number">3</span>
              <h3>Да го създадем.</h3>
              <p>
                Съгласуваме изпълнението и превръщаме индивидуалния проект в
                дом.
              </p>
            </li>
          </ol>
        </section>

        <section
          className="questions section-wrap"
          id="questions"
          aria-labelledby="questions-title"
        >
          <div className="questions-intro">
            <h2 id="questions-title">
              Нека изясним
              <br />
              детайлите.
            </h2>
            <p>
              Имате друг въпрос?
              <br />
              <a href={contact.phoneHref}>Обадете ни се.</a>
            </p>
          </div>
          <Accordion className="faq-list">
            {questions.map((question, index) => (
              <AccordionItem key={question.title} value={`question-${index}`}>
                <AccordionTrigger>{question.title}</AccordionTrigger>
                <AccordionContent>{question.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div>
            <p>От идеята до последния детайл.</p>
            <h2 id="contact-title">
              Да създадем
              <br />
              вашия дом.
            </h2>
          </div>
          <div className="contact-actions">
            <p>
              Разкажете ни какво си представяте.
              <br />
              Ние ще ви помогнем да започнете.
            </p>
            <ButtonLink className="contact-email" href={inquiryHref()}>
              Изпратете запитване
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
            <a className="contact-phone" href={contact.phoneHref}>
              <Phone aria-hidden="true" />
              {contact.phone}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Brand footer />
        <div>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>© {new Date().getFullYear()} Casanova</span>
        </div>
        <a className="footer-top" href="#top">
          Към началото
          <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>

      <Dialog
        open={selectedHouse !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedHouse(null)
        }}
      >
        <DialogContent
          ref={dialogRef}
          initialFocus={dialogRef}
          className="house-dialog"
          showCloseButton={false}
        >
          {selectedHouse && (
            <HouseDetails key={selectedHouse.slug} house={selectedHouse} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
