# Templates

What the generator can produce.

## base-monorepo
- Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`.
- No apps; used as a foundation when building combos.

## shell-react / shell-vue
- Vite app with federation host config.
- `remotes` map seeded with one sample remote.
- Basic layout (header/main/footer) and lazy remote loading.

## remote-react / remote-vue
- Vite app exposing `./App` via federation.
- Minimal UI and counter demo.

## create-mfe-stack options
- Project type: complete platform (shell + first remote), shell only, remote only.
- Framework: React or Vue.
- Features toggles (as implemented in prompts): shared state, design system starter, CI/CD, Docker (availability depends on current template set).
