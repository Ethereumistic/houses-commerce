import { useRef } from "react"
import { ArrowUpRight, Check, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonLink } from "@workspace/ui/components/button-link"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ProductImage } from "./product-image"
import { inquiryHref } from "../data/collections"
import type { Collection } from "../data/collections"

export function CollectionDialog({
  collection,
  onClose,
}: {
  collection: Collection | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  return (
    <Dialog
      open={collection !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        ref={dialogRef}
        initialFocus={dialogRef}
        className="aio-product-dialog"
        showCloseButton={false}
      >
        {collection && (
          <>
            <div className="aio-detail-image">
              <ProductImage
                name={collection.image}
                alt={collection.imageAlt}
                priority
                wide
              />
            </div>
            <div className="aio-detail-body">
              <DialogTitle className="aio-detail-title">
                {collection.title}
              </DialogTitle>
              <DialogDescription className="aio-detail-description">
                {collection.description}
              </DialogDescription>
              <ul className="aio-detail-features">
                {collection.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              {collection.secondaryImage && (
                <div className="aio-detail-secondary">
                  <ProductImage
                    name={collection.secondaryImage}
                    alt={
                      collection.id === "roofing"
                        ? "Керамичен покрив с интегрирани соларни панели"
                        : "Интериорни мебели от масивна дървесина"
                    }
                    wide
                  />
                </div>
              )}
              <p className="aio-detail-note">
                Изображенията са концептуални визуализации. Материалите,
                размерите, наличностите и изпълнението се уточняват при
                индивидуално запитване.
              </p>
              <ButtonLink
                className="aio-green-button aio-detail-inquiry"
                href={inquiryHref(collection)}
              >
                Запитване за{" "}
                {collection.id === "roofing" ? "керемиди" : "проект"}
                <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            </div>
            <DialogClose
              className="aio-detail-close"
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
        )}
      </DialogContent>
    </Dialog>
  )
}
