# Multi-Framework Cart (React + Vue)

React shell + React products remote + Vue cart remote, all sharing cart and theme state through `@mfe-stack/core`, `@mfe-stack/react`, and `@mfe-stack/vue`.

## Run it locally
```bash
cd examples/multi-framework
pnpm install
pnpm dev              # runs shell (3000), cart (3001), products (3002) via turbo

# Optional: run apps individually
pnpm --filter @multi-framework/shell dev
pnpm --filter @multi-framework/cart dev
pnpm --filter @multi-framework/products dev
```

Open:
- Shell: http://localhost:3000
- Cart (Vue): http://localhost:3001
- Products (React): http://localhost:3002

## What you’ll see
- Add to cart in React products → badge updates in shell and cart appears in Vue remote.
- Adjust quantities or remove in Vue cart → badge updates in shell.
- Theme toggle in shell updates shared `theme` state visible across apps.

## Build
```bash
pnpm build
```
- Outputs live under each app’s `dist/` via Turbo (check `apps/*/dist`).

## What’s inside
- Dependencies: `@mfe-stack/core`, `@mfe-stack/react`, `@mfe-stack/vue`, `zod` resolved from the workspace.
- `packages/shared/src/index.ts` — Zod schema + `cartBridge` + helpers (`addToCart`, `updateQuantity`, `removeItem`, `toggleTheme`).
- `apps/shell/src/App.tsx` — Shell header, theme toggle, cart badge, and remote loading.
- `apps/products/src/App.tsx` — React grid that dispatches add-to-cart actions.
- `apps/cart/src/App.vue` — Vue cart UI with quantity controls.
- `apps/*/vite.config.ts` — Module Federation wiring (shell consumes `products` and `cart`).

## Demo flow
1) Add to cart in the React products remote → badge updates in the shell, list updates in the Vue cart.
2) Adjust quantity or remove items in the Vue cart → badge updates in the shell.
3) Toggle theme in the shell → value is shared and visible across apps.

## Troubleshooting
- Remote 404? Check URLs in `apps/shell/vite.config.ts` match the remote ports.
- State not syncing? Ensure every app imports `cartBridge` from `@multi-framework/shared` (no local copies).
- Type errors? Run `pnpm install` once, then `pnpm dev` to refresh TS project references.
