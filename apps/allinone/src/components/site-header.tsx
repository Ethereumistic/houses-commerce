import { useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonLink } from "@workspace/ui/components/button-link"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { contact } from "../data/collections"

const navigation = [
  { href: "#collections", label: "Колекции" },
  { href: "#roofing", label: "Керамични покриви" },
  { href: "#craft", label: "Нашият подход" },
]

export function Brand() {
  return (
    <a className="aio-brand" href="#top" aria-label="All in One — начало">
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
        all in one<span className="aio-brand-dot">.</span>
      </span>
    </a>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="aio-header">
      <Brand />
      <nav className="aio-desktop-nav" aria-label="Основна навигация">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <ButtonLink
        className="aio-green-button aio-header-contact"
        href="#contact"
      >
        Вашият проект
        <ArrowUpRight aria-hidden="true" />
      </ButtonLink>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="aio-menu-trigger"
          render={
            <Button size="icon" variant="ghost" aria-label="Отворете менюто" />
          }
        >
          <Menu aria-hidden="true" />
        </SheetTrigger>
        <SheetContent className="aio-mobile-menu" showCloseButton={false}>
          <SheetTitle>all in one.</SheetTitle>
          <SheetDescription>Всичко за мястото, което обичате.</SheetDescription>
          <SheetClose
            className="aio-menu-close"
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
              { href: "#questions", label: "Въпроси" },
              { href: "#contact", label: "Вашият проект" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <a className="aio-menu-phone" href={contact.phoneHref}>
            {contact.phone}
          </a>
        </SheetContent>
      </Sheet>
    </header>
  )
}
