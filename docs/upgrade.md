# Upgrade guide

## Upgrading @mfe-stack packages
1) Update versions in package.json across apps and shared packages to the same tag.
2) `pnpm install`
3) `pnpm build` to confirm compatibility.

## Regenerating templates
- New template changes do not auto-apply to existing projects. Compare new template files in `packages/create-mfe-stack/templates/` and port changes manually.

## Federation config changes
- If remote names or ports change, update shell `vite.config.ts` remotes map and `remotes.d.ts`.

## Breaking changes checklist
- React/Vue major bumps: ensure all MFEs upgrade together.
- Vite/plugin-federation bumps: rebuild and verify `remoteEntry.js` loads in shell.
- Bridge schema changes: add defaults and migrations to avoid runtime validation failures.
