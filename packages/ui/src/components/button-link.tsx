import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@workspace/ui/components/button"

// Reuse shadcn's button styling while keeping native link semantics.
function ButtonLink({
  className,
  variant = "default",
  size = "default",
  ...props
}: ComponentProps<"a"> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { ButtonLink }
