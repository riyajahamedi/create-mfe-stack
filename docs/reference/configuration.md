# Configuration Reference

## turbo.json
- Defines tasks (`dev`, `build`, `lint`, `test`, `clean`).
- `dev` is non-cached/persistent; `build` depends on upstream `^build`.

## pnpm-workspace.yaml
- Workspace globs. Templates typically include `apps/*` and `packages/*`.

## vite.config.ts (shell)
- Federation host: `remotes` map pointing to remote `remoteEntry.js` URLs.
- Shared deps: `shared: ['react', 'react-dom']` (or `['vue']`).
- Ports: `server.port` and `preview.port`.

## vite.config.ts (remote)
- Federation remote: `name`, `filename: 'remoteEntry.js'`, `exposes` with `./App`.
- Ports: dev/preview ports must match what shell expects.

## Type declarations
- Shell needs `remotes.d.ts` to type remote modules.

## Path layout
- Apps live in `apps/`; shared code in `packages/`. Keep bridges/helpers in a shared package so every MFE imports the same instance.
