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

## Casa Nova hosting and Commerce

Casa Nova deploys to the Cloudflare Worker `casanova`, with the custom domain
<https://casanova.echoray.cloud>. Its Echoray business is
[`ks7b2qvhzs7ekqgbnavv1hedps8g6e7y`](https://dev.echoray.io/dashboard/ks7b2qvhzs7ekqgbnavv1hedps8g6e7y).
Cloudflare settings are in `apps/casanova/wrangler.jsonc`. Deploy from the root:

```bash
pnpm --filter casanova deploy
```

The Cloudflare Vite adapter applies to production builds; local development
continues to use the existing Vite server. Deployments preserve dashboard-managed
variables and secret bindings.

Gateway `p175bnas6hrc98w4gm8tbb94yx8g6sw1` was registered and domain-verified on
2026-10-13. Its integration ID, integration secret and domain challenge are saved
as protected Worker bindings. The challenge endpoint returns HTTP 200 with the
registered challenge. The Commerce catalog is published with six inquiry-only
house models. The homepage reads category names, category-filtered product pages,
main photos and product details through the standalone Echoray public-catalog SDK.
Tabs use exact Commerce category names in the `collection` search parameter.
Card reference geometry remains in `houses.ts`; dialog specifications come from
Commerce. Router data refreshes within 30 seconds while visible, and responses
use `Cache-Control: no-store`. Gateway failures have an explicit unavailable state.
Product seed files and upload manifests live in `commerce/casanova/products`.
Their approved internal price is EUR 0, with zero made-to-order capacity; the
website displays “Цена по запитване” and keeps the inquiry workflow.

Domains are managed in Echoray Commerce (admin.echoray.io) → Settings → Website and
domain, not in Payments. This business is linked to the `casanova` Worker there, so
Echoray attaches every domain added on that page to this Worker as a zone route and
keeps the Worker's `STOREFRONT_ORIGIN` secret set to the shop's address. Requests on
any other connected host redirect to that address (`src/server.ts`). Keep
`STOREFRONT_ORIGIN` out of `wrangler.jsonc` `vars`: a plain variable blocks the secret.
Keep the `routes` in `wrangler.jsonc` to custom domains only. A deploy replaces the
Worker's custom domains, and it would also replace the routes Echoray added if the
config listed plain routes. Public catalog consumption is implemented; shopper
authentication and checkout remain outside this inquiry-only website.

For catalog administration with the installed Echoray Commerce CLI, save the
shop API key through its hidden terminal prompt into the OS keyring:

```bash
node ~/.codex/skills/echoray-commerce/scripts/commerce.mjs auth setup --profile casanova --expect-shop 'Casa Nova'
node ~/.codex/skills/echoray-commerce/scripts/commerce.mjs shop --profile casanova
```

Always select `--profile casanova` for Casa Nova catalog operations. This shop
administration key is separate from the storefront integration secret. Never
store either credential in source files or client environment variables.

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
