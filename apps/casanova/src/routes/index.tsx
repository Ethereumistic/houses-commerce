import { useRef, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
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
  categoryLabels,
  contact,
  footprint,
  houses,
  inquiryHref,
} from "../data/houses"
import type { House } from "../data/houses"

export const Route = createFileRoute("/")({ component: Homepage })

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

function HouseCard({
  house,
  onSelect,
}: {
  house: House
  onSelect: (house: House) => void
}) {
  const size = footprint(house)
  return (
    <article className="house-card">
      <Button
        className="house-image-button"
        variant="ghost"
        onClick={() => onSelect(house)}
        aria-label={`Разгледайте ${house.name}`}
      >
        <HouseImage
          id={house.id}
          alt={`Casanova ${house.name} — ${categoryLabels[house.category].toLowerCase()}, ${size.length} × ${size.width} м`}
        />
        <span className="house-image-action">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </Button>
      <div className="house-card-heading">
        <h3>{house.name}</h3>
        <span>
          {size.length} × {size.width} м
        </span>
      </div>
      <p className="house-category">{categoryLabels[house.category]}</p>
      <div className="house-card-bottom">
        <div className="house-room-list">
          <span>
            <BedDouble aria-hidden="true" />
            {house.bedrooms === 0
              ? "Студио"
              : `${house.bedrooms} ${house.bedrooms === 1 ? "спалня" : "спални"}`}
          </span>
          <span>
            <Bath aria-hidden="true" />
            {house.bathrooms} {house.bathrooms === 1 ? "баня" : "бани"}
          </span>
        </div>
        <span className="house-area">{size.area} м²</span>
      </div>
    </article>
  )
}

function HouseDetails({ house }: { house: House }) {
  const size = footprint(house)
  return (
    <>
      <div className="detail-image">
        <HouseImage
          id={house.id}
          alt={`Архитектурна визуализация на Casanova ${house.name}`}
          hero
        />
      </div>
      <div className="detail-body">
        <p className="detail-category">{categoryLabels[house.category]}</p>
        <DialogTitle className="detail-title">
          Casanova {house.name}
        </DialogTitle>
        <DialogDescription className="detail-description">
          {house.description}
        </DialogDescription>
        <dl className="detail-specs">
          <div>
            <dt>Габарити</dt>
            <dd>
              {size.length} × {size.width} м
            </dd>
          </div>
          <div>
            <dt>Габаритна площ</dt>
            <dd>{size.area} м²</dd>
          </div>
          <div>
            <dt>Спални / бани</dt>
            <dd>
              {house.bedrooms === 0 ? "Студио" : house.bedrooms} /{" "}
              {house.bathrooms}
            </dd>
          </div>
        </dl>
        <ul className="detail-features">
          {house.features.map((feature) => (
            <li key={feature}>
              <Check aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="detail-note">
          Ориентировъчни габарити, закръглени нагоре до цели метри, без тераса и
          стъпала. Изображението е концептуална визуализация. Разпределението и
          изпълнението се уточняват с индивидуален проект.
        </p>
        <ButtonLink
          className="brand-button detail-inquiry"
          href={inquiryHref(house)}
        >
          Изпратете запитване
          <ArrowUpRight aria-hidden="true" />
        </ButtonLink>
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
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const featuredHouse = houses[5]
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
          <Button
            className="hero-feature"
            variant="ghost"
            onClick={() => setSelectedHouse(featuredHouse)}
          >
            <span>
              <span className="hero-feature-name">Casanova XL 10</span>
              <span className="hero-feature-dimensions">
                12 × 8 м · две спални
              </span>
            </span>
            <span className="hero-feature-icon">
              <ArrowUpRight aria-hidden="true" />
            </span>
          </Button>
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
              Шест модела. Различни възможности.
              <br />
              Една отправна точка — вие.
            </p>
          </div>
          <Tabs defaultValue="all" className="catalog-tabs">
            <TabsList
              className="catalog-filters"
              aria-label="Филтър по конструкция"
            >
              <TabsTrigger value="all">
                Всички къщи <span>6</span>
              </TabsTrigger>
              <TabsTrigger value="timber">
                Дървени <span>2</span>
              </TabsTrigger>
              <TabsTrigger value="steel">
                Метални <span>4</span>
              </TabsTrigger>
            </TabsList>
            {["all", "timber", "steel"].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="house-grid">
                  {houses
                    .filter(
                      (house) =>
                        category === "all" || house.category === category
                    )
                    .map((house) => (
                      <HouseCard
                        key={house.id}
                        house={house}
                        onSelect={setSelectedHouse}
                      />
                    ))}
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
          {selectedHouse && <HouseDetails house={selectedHouse} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
