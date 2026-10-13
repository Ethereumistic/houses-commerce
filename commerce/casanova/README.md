# Casa Nova product seeds

Six Bulgarian house models are published in the Casa Nova business
`ks7b2qvhzs7ekqgbnavv1hedps8g6e7y`:

| Category | Models |
| --- | --- |
| Дървени | Студио, Една спалня |
| Метални | Две спални, XL 8, XL 9, XL 10 |

Each product file references its existing full-size generated WebP in
`apps/casanova/public/images` as the first and only gallery image. Do not replace
these with the smaller `-800.webp` files or copy the hero image to a product.
No category covers were uploaded; Echoray may derive a category preview from
the first published product. The website's category tabs display text only.

The merchant approved inquiry-only publication: EUR 0 is an internal placeholder,
`inventory: "made_to_order"` and `capacity: 0` prevent order availability, and the
website displays “Цена по запитване”. No prices, lead times or delivery capacity
have been promised. Product dimensions are proposed rounded footprints, not net
living areas; the original reference dimensions and links remain in `houses.ts`.

From the monorepo root, validate and preview a change before saving it:

```bash
node ~/.codex/skills/echoray-commerce/scripts/commerce.mjs validate commerce/casanova/products
node ~/.codex/skills/echoray-commerce/scripts/commerce.mjs push commerce/casanova/products --dry-run --profile casanova
node ~/.codex/skills/echoray-commerce/scripts/commerce.mjs push commerce/casanova/products --profile casanova
```

Pull and reconcile live changes before subsequent updates: a product file replaces
editable content, so stale seeds could overwrite dashboard edits. Preserve each
`.echoray-shop.json` upload manifest; it contains nonsecret content hashes and
storage IDs, and prevents duplicate uploads. Credentials stay in the OS keyring.
