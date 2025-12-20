# Migrate an existing app

How to retrofit an existing shell or remote into create-mfe-stack.

## If you have a shell
1) Add to monorepo under `apps/shell/` (or rename yours to match).
2) Add Vite + federation: install `@originjs/vite-plugin-federation`, update `vite.config.ts` with `remotes` map.
3) Add `remotes.d.ts` for TypeScript.
4) Add shared package for bridges (e.g., `packages/shared/`); import bridges from there.
5) Run `pnpm dev` and load remotes lazily with `React.lazy`.

## If you have a remote
1) Move it under `apps/<name>/`.
2) Expose `./App` in `vite.config.ts` federation config.
3) Point shell `remotes` map to the remote’s URL.
4) Ensure shared deps (React/Vue, @mfe-stack/*) match the shell versions.

## Shared package setup
- Create `packages/shared/` with `index.ts` exporting bridges/helpers.
- Add `@mfe-stack/core` + framework bindings (`@mfe-stack/react` or `@mfe-stack/vue`).
- Use path imports via workspace package name (e.g., `@myorg/shared`).

## Testing after migration
- `pnpm dev` to verify federation wiring.
- Toggle state in one MFE and confirm others update.
- Check console for federation import errors or schema validation errors.
