# Upgrade guide

## Upgrading @mfe-stack packages
1) Update versions in package.json across apps and shared packages to the same tag.
2) `pnpm install`
3) `pnpm build` to confirm compatibility.

## Regenerating templates
- New template changes do not auto-apply to existing projects. Compare new template files in `packages/create-mfe-stack/templates/` (see [templates changelog](reference/templates-changelog.md)) and port changes manually.

## Federation config changes
- If remote names or ports change, update shell `vite.config.ts` remotes map and `remotes.d.ts`.

## Breaking changes checklist
- React/Vue major bumps: ensure all MFEs upgrade together.
- Vite/plugin-federation bumps: rebuild and verify `remoteEntry.js` loads in shell.
- Bridge schema changes: add defaults and migrations to avoid runtime validation failures.

## Post-upgrade checks
- Run unit/component tests per [testing guide](how-to/testing.md); add mocks for remotes if shell-only tests fail.
- Start shell + remotes together and verify cross-MFE flows (e.g., shared state updates) still work.
- Open browser console/network to confirm `remoteEntry.js` loads from expected versions and CSP/CORS are still satisfied.
