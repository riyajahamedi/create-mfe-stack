# Versioning and shared deps

## Aligning versions
- Keep React/Vue versions consistent across shell/remotes to avoid duplicates.
- Pin `@mfe-stack/*` to the same version everywhere.
- Lock Vite and `@originjs/vite-plugin-federation` versions across apps.

## Shared section in federation
- Add common libs to `shared` to prevent multiple bundles: React/ReactDOM or Vue, plus other heavy deps you intend to share.
- Avoid sharing rapidly-changing app-specific deps; prefer explicit versioning per app.

## When versions diverge
- Expect larger bundles and possible runtime conflicts (hooks invariants for React, multiple Vue runtimes).
- Test remotes in isolation and through the shell.

## Release strategy
- Use tags or changesets to publish `@mfe-stack/*` together.
- For app deployments, publish shell and remotes in a coordinated release to avoid contract drift.
