# create-mfe-stack

CLI to scaffold production-ready micro-frontend stacks with Vite + Module Federation for React or Vue.

## Requirements
- Node >= 18
- Any package manager that supports `create`/`dlx` (pnpm, npm, yarn, bun)

## Quick start
```bash
pnpm dlx create-mfe-stack@latest
# or
npm create mfe-stack@latest
```
Follow the prompts to pick:
- Project type: complete platform (shell + first remote), shell only, or remote only.
- Framework: React or Vue.
- Feature toggles (as available): shared state, design system starter, CI/CD, Docker.

## What gets generated
- Monorepo workspace with pnpm + Turborepo config.
- Host shell using Vite + Module Federation.
- Sample remote exposing `./App` and wired into the shell.
- Shared packages for bridge/store utilities (React/Vue bindings).

## After generation
- Install deps in the new folder: `pnpm install` (or your package manager).
- Start dev servers: run the dev script shown in the generated README (usually `pnpm dev` or `pnpm dev --filter <app>` for multi-app setups).
- Build or test: `pnpm build`, `pnpm test` (where provided by the template).

## Docs
Full documentation, guides, and upgrade notes live in the repo: https://github.com/riyajahamedi/create-mfe-stack/tree/main/docs

## License
MIT
