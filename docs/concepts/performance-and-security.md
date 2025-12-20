# Performance and security

Make federated shells and remotes fast and safe.

## Performance
- Share deps: pin common versions (React/Vue, router, UI kit) in shell and remotes; add to `shared` to avoid duplicate bundles.
- Keep remotes lean: expose only what is needed (e.g., `./App`); avoid exporting large utility bundles.
- Lazy load: use dynamic import for remotes and optional features; gate experimental flags to avoid loading dead code.
- Code splitting: let Vite split vendor chunks; avoid extra manual splits that can hurt caching.
- Caching: set long `Cache-Control` on built assets and `remoteEntry.js`; bust caches with file hashes or versioned paths.
- Prefetch/preconnect: add `<link rel="preconnect">` to remote hosts; prefetch critical remotes for first paint paths only.
- Measurements: track TTFB, FCP, TTI for shell and remote renders; log bridge event timings when state crosses MFEs.
- CI checks: run `pnpm build` + bundle analyzer (e.g., `rollup-plugin-visualizer`) to catch growth before merging.

## Security
- HTTPS everywhere: require TLS between shell and remotes; avoid mixed content.
- CORS: restrict `Access-Control-Allow-Origin` to known shells; avoid `*` on cookies or authenticated remotes.
- CSP: set `script-src` to trusted hosts (shell + remote origins); add hashes/nonces for inline scripts in host HTML.
- Remote integrity: version remote entry URLs; do not load from untrusted origins; prefer private registry/CDN.
- Secrets: keep tokens/keys server-side; do not bake secrets into remotes or federated configs.
- Input validation: validate props/payloads arriving via bridge; add schema validation to guard runtime data.
- Error isolation: wrap remote mounts in error boundaries; fail closed (hide feature) if remote load errors.
- Dependencies: scan remotes and shell with `pnpm audit`/SAST; align critical packages across MFEs to reduce attack surface.
