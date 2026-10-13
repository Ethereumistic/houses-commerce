# Repository instructions

## Workspace and development

- This pnpm/Turborepo monorepo contains two TanStack Start + React + Tailwind CSS
  + shadcn/ui websites owned by the same owner.
- `apps/casanova`: Casanova; red brand accents; http://localhost:3000.
- `apps/allinone`: All in One; green brand accents; http://localhost:3001.
- `packages/ui`: the single shared home for UI components, hooks, utilities,
  their dependencies, and base styles.
- **Always assume the user is already running both development servers.** Use
  the existing URLs for verification. Do not start, stop, or restart development
  servers unless the user explicitly asks. If a server is unavailable, report it
  and continue work that does not depend on it.
- The user's root startup command is `vp run dev`; it starts both apps concurrently.

## Product domains

- **Casanova:** small wooden houses and medium metal construction houses. The
  current homepage has six models inspired by Samara's published footprints,
  converted to metres and rounded up per side: 9 x 5, 12 x 5, 15 x 5, 10 x 8,
  11 x 8, and 12 x 8 metres. XL 10 is the largest by footprint area (96 m²).
  Keep reference dimensions and source links in `apps/casanova/src/data/houses.ts`;
  rounded footprint area is not net living area. The brochures also present modern
  designer homes, individual architectural planning and construction, interior
  furnishing, garden solutions, and smart-home integration/consultation (iNELS).
- **All in One:** primarily wooden products and home/garden fittings: swings,
  canopies, sheds, awnings, verandas, pergolas, garden and interior furniture,
  decorative wooden accents, ceramic roof tiles, and interior/exterior lighting.
  The brochures also show custom timber work, renovation and maintenance of
  outdoor structures/furniture, and roofing with integrated solar systems.
- Reference images are in the root `assets/` directory (lowercase on disk):
  `1.jpg` and `2.jpg` belong to Casanova; `3.jpg` and `4.jpg` belong to All in One.
  Inspect the relevant images when working on branding or product content. They
  are Bulgarian brochures; keep each brand's products and identity distinct.

## Mandatory shadcn/ui workflow

1. **Before building any new component, check the existing shared components and
   the shadcn/ui catalog for suitable building blocks.**
2. **Always use shadcn/ui components when building UI.** Compose custom layouts
   and product features from those components; do not recreate available UI
   primitives or introduce a competing component library.
3. Install missing building blocks once in `packages/ui`. Never duplicate shadcn
   components under either app or install the same primitive separately for both.
4. Keep reusable components, hooks, utilities, and their dependencies in the
   shared package. App-specific pages and product compositions belong in the apps
   and import the shared primitives.

Run this exact command **from the monorepo root** to add Accordion:

```bash
pnpm dlx shadcn@latest add accordion --cwd packages/ui
```

Root shortcut (forwards component names and CLI options to the same shared target):

```bash
pnpm ui:add accordion
pnpm ui:add card dialog input
```

The equivalent command when already inside `packages/ui` is:

```bash
pnpm dlx shadcn@latest add accordion
```

- `packages/ui/components.json` defines the shared installation target and
  `@workspace/ui/...` aliases. Both apps already depend on `@workspace/ui`.
- Component files go in `packages/ui/src/components`; hooks in `src/hooks`;
  utilities in `src/lib`; component dependencies in `packages/ui/package.json`.
- Import from the shared package in either app:

```tsx
import { Accordion } from "@workspace/ui/components/accordion"
import { Button } from "@workspace/ui/components/button"
```

- Check whether a file already exists before installing; preserve local
  customizations rather than blindly using `--overwrite`.
- Retain the existing `base-vega` style, Base UI primitives, Lucide icons, neutral
  base color, and CSS variables. Keep the apps' shadcn configuration compatible
  with the shared package.
- Shared base styles are in `packages/ui/src/styles/globals.css`. All in One's
  green overrides are in `apps/allinone/src/styles.css`; preserve Casanova's red
  accents when adding or updating shared components. Use semantic theme tokens
  rather than hardcoded brand colors in shared components.

### Component catalog

Available building blocks from the supplied catalog (not all installed):

Accordion, Alert, Alert Dialog, Aspect Ratio, Attachment, Avatar, Badge,
Breadcrumb, Bubble, Button, Button Group, Calendar, Card, Carousel, Chart,
Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker,
Dialog, Direction, Drawer, Dropdown Menu, Empty, Field, Hover Card, Input,
Input Group, Input OTP, Item, Kbd, Label, Marker, Menubar, Message,
Message Scroller, Native Select, Navigation Menu, Pagination, Popover, Progress,
Questionnaire, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet,
Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle,
Toggle Group, Tooltip, Typography.

Consult the component's installation instructions: some entries are composition
recipes rather than standalone CLI registry items. Catalog:
https://ui.shadcn.com/docs/components. CLI and shared-workspace guidance:
https://ui.shadcn.com/docs/cli and https://ui.shadcn.com/docs/monorepo.

## Verification

Use checks appropriate to the change: `vp run typecheck`, `vp run lint`, and
`vp run build`. Verify UI against the user's already-running servers.
