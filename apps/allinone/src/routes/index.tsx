import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ArrowDown,
  ArrowUpRight,
  Leaf,
  Phone,
  Ruler,
  Sun,
  Wrench,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Brand, SiteHeader } from "../components/site-header"
import { ProductImage } from "../components/product-image"
import { CollectionDialog } from "../components/collection-dialog"
import {
  collections,
  contact,
  filters,
  inGroup,
  inquiryHref,
  questions,
} from "../data/collections"
import type { Collection } from "../data/collections"

export const Route = createFileRoute("/")({ component: Homepage })

function CollectionCard({
  collection,
  featured,
  onSelect,
}: {
  collection: Collection
  featured: boolean
  onSelect: (collection: Collection) => void
}) {
  return (
    <article
      className={
        featured
          ? "aio-collection-card aio-featured-card"
          : "aio-collection-card"
      }
    >
      <Button
        variant="ghost"
        className="aio-collection-image"
        aria-label={`Разгледайте ${collection.title.toLowerCase()}`}
        onClick={() => onSelect(collection)}
      >
        <ProductImage name={collection.image} alt={collection.imageAlt} />
        <span className="aio-card-arrow">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </Button>
      <h3>{collection.title}</h3>
      <p>{collection.subtitle}</p>
    </article>
  )
}

function Homepage() {
  const [selected, setSelected] = useState<Collection | null>(null)
  const roofing = collections.find((collection) => collection.id === "roofing")
  return (
    <div className="aio-site" id="top">
      <a className="aio-skip-link" href="#main">
        Към основното съдържание
      </a>
      <SiteHeader />
      <main id="main">
        <section className="aio-hero" aria-labelledby="hero-title">
          <ProductImage
            name="garden-pavilion"
            alt="Дървен градински павилион с уютна мека мебел, заобиколен от цветя и зеленина"
            priority
            wide
            className="aio-hero-image"
          />
          <div className="aio-hero-shade" />
          <div className="aio-hero-copy">
            <p>Всичко за мястото, което обичате.</p>
            <h1 id="hero-title">
              Повече живот.
              <br />
              Навън.
            </h1>
            <ButtonLink className="aio-white-button" href="#collections">
              Разгледайте колекциите
              <ArrowDown aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="aio-hero-caption">
            <span>Навеси от масивна дървесина</span>
            <span>Създадени за вашия двор.</span>
          </div>
        </section>

        <section className="aio-intro aio-wrap" aria-labelledby="intro-title">
          <h2 id="intro-title">
            От първата сянка.
            <br />
            До последния детайл.
          </h2>
          <div>
            <p>
              Навес за дългите летни дни. Люлка за миговете на тишина. Мебели,
              които носят характер. Създаваме решения за дома и градината с
              естествени материали и внимание към вас.
            </p>
            <p className="aio-secondary-copy">
              Дървени конструкции, обзавеждане, керамични покриви и осветление.
              Всичко, което превръща едно място във ваше.
            </p>
          </div>
        </section>

        <section
          className="aio-collections aio-wrap"
          id="collections"
          aria-labelledby="collections-title"
        >
          <div className="aio-section-heading">
            <h2 id="collections-title">
              Намерете вашето
              <br />
              любимо място.
            </h2>
            <p>
              За градината, за дома,
              <br />
              за ежедневните удоволствия.
            </p>
          </div>
          <Tabs defaultValue="all" className="aio-collection-tabs">
            <TabsList
              className="aio-collection-filters"
              aria-label="Филтър по продуктова категория"
            >
              {filters.map((filter) => (
                <TabsTrigger key={filter.id} value={filter.id}>
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {filters.map((filter) => (
              <TabsContent key={filter.id} value={filter.id}>
                <div
                  className={
                    filter.id === "all"
                      ? "aio-collection-grid aio-all-collections"
                      : "aio-collection-grid"
                  }
                >
                  {collections
                    .filter((collection) => inGroup(collection, filter.id))
                    .map((collection, index) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        featured={filter.id === "all" && index < 2}
                        onSelect={setSelected}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section
          className="aio-roofing"
          id="roofing"
          aria-labelledby="roofing-title"
        >
          <div className="aio-roof-photo">
            <ProductImage
              name="ceramic-roof"
              alt="Керамичен покрив в графитено сиво с интегрирани соларни панели, дървена стреха и изглед към гората"
              wide
            />
          </div>
          <div className="aio-roof-content aio-wrap">
            <div>
              <p className="aio-material-label">Керамика. С характер.</p>
              <h2 id="roofing-title">
                Красив дом.
                <br />
                От покрива надолу.
              </h2>
            </div>
            <div className="aio-roof-description">
              <p>
                Керамичните керемиди придават завършен облик на дома. Открийте
                повърхности и цветове, които допълват архитектурата — от
                естествените нюанси до дълбоко графитено сиво.
              </p>
              <p>
                При интерес обсъждаме и интегрирани соларни решения, съобразени
                с вашия покрив.
              </p>
              <Button
                className="aio-outline-button"
                variant="outline"
                onClick={() => {
                  if (roofing) setSelected(roofing)
                }}
              >
                Разгледайте керемидите
                <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section
          className="aio-craft aio-wrap"
          id="craft"
          aria-labelledby="craft-title"
        >
          <div className="aio-craft-copy">
            <h2 id="craft-title">
              Усеща се дървото.
              <br />
              Личи си ръката.
            </h2>
            <p>
              Дъб, орех, бук. Всяка дървесина има свой характер. Подбираме
              материала и обработката според изделието, а размерите — според
              вашето пространство.
            </p>
            <div className="aio-craft-detail">
              <Ruler aria-hidden="true" />
              <div>
                <h3>По вашата мярка.</h3>
                <p>
                  Индивидуален дизайн, авторски изделия и поръчки по проект.
                </p>
              </div>
            </div>
            <div className="aio-craft-detail">
              <Leaf aria-hidden="true" />
              <div>
                <h3>Естествено, до последния детайл.</h3>
                <p>Масивна дървесина, внимателна обработка и подходящ финиш.</p>
              </div>
            </div>
            <ButtonLink
              className="aio-text-button"
              variant="ghost"
              href="#contact"
            >
              Нека обсъдим вашата идея
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="aio-craft-photo">
            <ProductImage
              name="interior-furniture"
              alt="Ръчно изработен дъбов бюфет и трапезарна маса с естествено осветление"
            />
            <span>За дома. Със същото внимание.</span>
          </div>
        </section>

        <section className="aio-care aio-wrap" aria-labelledby="care-title">
          <Wrench aria-hidden="true" />
          <div>
            <h2 id="care-title">Красивото заслужава грижа.</h2>
            <p>
              Реновиране и поддръжка на навеси, перголи, парапети и градински
              мебели. За да продължите да се радвате на любимото си място.
            </p>
          </div>
          <ButtonLink
            className="aio-outline-button"
            variant="outline"
            href={inquiryHref()}
          >
            Обсъдете обновяване
            <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
        </section>

        <section
          className="aio-process aio-wrap"
          aria-labelledby="process-title"
        >
          <div className="aio-section-heading">
            <h2 id="process-title">
              Вашата идея.
              <br />
              Нашата работа.
            </h2>
            <p>От разговора до готовия детайл.</p>
          </div>
          <ol>
            <li>
              <span>1</span>
              <h3>Разкажете ни.</h3>
              <p>
                Какво си представяте? Изпратете идея, размери или снимки на
                мястото.
              </p>
            </li>
            <li>
              <span>2</span>
              <h3>Избираме заедно.</h3>
              <p>
                Уточняваме материалите, дизайна и бюджета в индивидуална оферта.
              </p>
            </li>
            <li>
              <span>3</span>
              <h3>Създаваме го.</h3>
              <p>
                Съгласуваме изпълнението и монтажа, с внимание към всеки детайл.
              </p>
            </li>
          </ol>
        </section>

        <section
          className="aio-questions aio-wrap"
          id="questions"
          aria-labelledby="questions-title"
        >
          <div>
            <h2 id="questions-title">
              Добре е<br />
              да знаете.
            </h2>
            <p>
              Имате друга идея или въпрос?
              <br />
              <a href={contact.phoneHref}>Нека поговорим.</a>
            </p>
          </div>
          <Accordion className="aio-faq">
            {questions.map((question, index) => (
              <AccordionItem key={question.title} value={`question-${index}`}>
                <AccordionTrigger>{question.title}</AccordionTrigger>
                <AccordionContent>{question.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section
          className="aio-contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div>
            <Sun aria-hidden="true" />
            <h2 id="contact-title">
              Нека направим
              <br />
              място за хубавото.
            </h2>
          </div>
          <div className="aio-contact-actions">
            <p>
              Градината. Домът. Вашият следващ проект.
              <br />
              Започваме с един разговор.
            </p>
            <ButtonLink className="aio-white-button" href={inquiryHref()}>
              Изпратете запитване
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
            <a className="aio-contact-phone" href={contact.phoneHref}>
              <Phone aria-hidden="true" />
              {contact.phone}
            </a>
          </div>
        </section>
      </main>
      <footer className="aio-footer">
        <div>
          <Brand />
          <p>Създадено за вашето място.</p>
        </div>
        <div>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>© {new Date().getFullYear()} All in One</span>
        </div>
        <a className="aio-to-top" href="#top">
          Към началото
          <ArrowUpRight aria-hidden="true" />
        </a>
        <p className="aio-image-note">
          Изображенията са концептуални визуализации. Продуктите и изпълнението
          се уточняват по индивидуален проект.
        </p>
      </footer>
      <CollectionDialog
        collection={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
