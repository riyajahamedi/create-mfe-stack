# Hosting and builds

## Build
```bash
pnpm build          # or mfe build
```
- Outputs under each app’s `dist/` (e.g., `apps/shell/dist`, `apps/remote/dist`).
- `remoteEntry.js` is emitted in `dist/assets/` for each remote.

## Serving options
- Static hosting (Netlify, Vercel, S3+CloudFront): upload `dist/` per app; ensure remotes are reachable at the URLs configured in the shell.
- Containers: wrap each app in its own image; expose configured port; set shell remotes to the deployed URLs.
- CDN: cache `remoteEntry.js` with cache-busting filenames; set long cache TTL with cache-busting query/version if needed.

## URL configuration
- In prod, update shell `remotes` URLs to the deployed origins of each remote.
- Keep protocol/host consistent; enable HTTPS and CORS if cross-origin.

## Cache + invalidation
- Versioned filenames from Vite help; if using fixed names, bust caches via query params or headers.
- Align deployments so shell and remotes publish together to avoid mismatched contracts.
