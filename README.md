# Houses Commerce

Two independent TanStack Start websites with shared shadcn/ui components:

- `apps/casanova`: Casanova, using the existing red theme.
- `apps/allinone`: Allinone, using a green theme.
- `packages/ui`: shared components, utilities, fonts, and base styles.

The websites belong to the same owner and serve different product ranges. The
housing range includes small wooden houses and medium metal construction houses.
Casanova's Bulgarian homepage presents six models with rounded metric footprints,
from the 9 x 5 metre Studio to the 12 x 8 metre XL 10 (the largest by area).

## Development

Install dependencies from the monorepo root:

```bash
pnpm install
```

Start both websites concurrently from the root:

```bash
vp run dev
```

- Casanova: http://localhost:3000
- Allinone: http://localhost:3001

The root script uses Turborepo to run both apps. Each app has a fixed port and a
separate TanStack devtools port (4206 and 4207). If an app port is occupied, it
fails clearly instead of switching URLs. Press Ctrl+C to stop both servers.

To start just one app:

```bash
pnpm --filter casanova dev
pnpm --filter allinone dev
```

## Checks

```bash
vp run typecheck
vp run lint
vp run build
```

## Adding components

Install components once in the shared UI package from the monorepo root:

```bash
pnpm dlx shadcn@latest add accordion --cwd packages/ui
```

Or use the root shortcut:

```bash
pnpm ui:add accordion
```

Both apps use components in `packages/ui/src/components`:

```tsx
import { Button } from "@workspace/ui/components/button"
```

Allinone imports the shared base styles and overrides only brand color tokens in
`apps/allinone/src/styles.css`, for both light and dark modes.
