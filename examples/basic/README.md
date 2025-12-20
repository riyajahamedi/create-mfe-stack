# Basic Counter (React + React)

Minimal two-app setup to show state sharing: a React shell hosts a React counter remote. Both render the same count and stay in sync via `@mfe-stack/core` and `@mfe-stack/react`.

## Run it locally
```bash
cd examples/basic
pnpm install
pnpm dev           # runs shell (3000) and remote (3001) via turbo

# Optional: run apps individually
pnpm --filter @basic/shell dev
pnpm --filter @basic/counter dev
```

Open:
- Shell: http://localhost:3000
- Counter remote: http://localhost:3001

## What you’ll see
- Shell shows count and increments; remote shows the same count and decrements.
- Both update instantly via the shared bridge; `lastUpdatedBy` flips based on which app acted last.

## Build
```bash
pnpm build
```
- Outputs live under each app’s `dist/` via Turbo (check `apps/*/dist`).

## What’s inside
- Dependencies: `@mfe-stack/core`, `@mfe-stack/react`, `zod` resolved from the workspace.
- `packages/shared/src/index.ts` — Zod schema + `counterBridge` + helpers (`increment`, `decrement`).
- `apps/shell/src/App.tsx` — Reads shared state and increments.
- `apps/counter/src/App.tsx` — Reads shared state and decrements.
- `apps/*/vite.config.ts` — Module Federation wiring (shell consumes the `counter` remote).

## Troubleshooting
- Remote not loading? Confirm `apps/shell/vite.config.ts` points to the remote’s port (3001).
- State not syncing? Make sure both apps import `counterBridge` from `@basic/shared` (the workspace package).
- Type errors? Run `pnpm install` once, then `pnpm dev` to refresh TS project references.
