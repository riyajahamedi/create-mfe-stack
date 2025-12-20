# CI/CD

## Minimal pipeline
- Install: `pnpm install`
- Lint/Test: `pnpm lint`, `pnpm test` (if configured)
- Build: `pnpm build`

## GitHub Actions (recommendation)
- `ci`: on PR/main — install, lint, test, build (no publish).
- `publish`: on `v*` tags — publish npm packages (`create-mfe-stack`, `@mfe-stack/*`) if public.
- `release` (changesets flow): on merge to main — opens "Version Packages" PR; merging that PR publishes.

## Artifacts
- Upload `apps/*/dist` for verification or downstream deploy steps.
- Optionally upload `turbo` cache between runs to speed builds.

## Env and secrets
- `NPM_TOKEN` for publishing packages.
- Any registry mirrors or private registries if used.
