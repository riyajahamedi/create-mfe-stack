# Module Federation in this stack

`@originjs/vite-plugin-federation` powers dynamic loading between shell and remotes.

## How it is wired
- Shell: defines `remotes` map with remote names and URLs to `remoteEntry.js`.
- Remote: exposes modules (usually `./App`) via `exposes` and serves `remoteEntry.js`.
- Shared: core libs marked as shared to avoid duplicates (react, react-dom, vue).

## Ports and URLs
- Templates default to shell 3000 and first remote 3001; multi-remote examples use 3001/3002.
- Update `vite.config.ts` in the shell if you change a remote’s port or host.

## Adding remotes
- Preferred: `mfe add <name> --framework react|vue --port <port>` updates configs for you.
- Manual: add `remotes` entry in shell `vite.config.ts`, ensure remote exposes `./App`, align ports.

## Versioning Shared Deps
- Keep React/Vue versions aligned across MFEs to prevent multiple bundles.
- Pin `@mfe-stack/*` to the same version in all apps.
- If you must diverge, verify runtime compatibility; duplication can increase bundle size.

## Dev vs Prod
- Dev: remotes served from Vite dev servers at configured ports.
- Build: `vite build` emits `remoteEntry.js` in `dist/assets`; host can serve static files or behind CDN.

## Troubleshooting
- 404 for remote: check URL in shell remotes map and that the remote dev server is running.
- Module type errors: ensure `remotes.d.ts` (shell) declares remote modules for TS.
- CORS: if hosting remotes separately, allow host origin on the remote server.
