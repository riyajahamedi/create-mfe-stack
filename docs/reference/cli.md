# CLI Reference

## Scaffolding CLI (create-mfe-stack)
- `npx create-mfe-stack <name>` or `pnpm create mfe-stack <name>`
- Prompts: project type (complete/shell/remote), framework (React/Vue), features, package manager.
- Output: monorepo with apps, packages, turbo/pnpm config, selected templates.

## Dev CLI (`mfe`)
- `mfe dev [--filter <app>]` — start dev servers (shell + remotes) with Turbo.
- `mfe build [--filter <app>] [--analyze]` — build all or one app.
- `mfe add <name> --framework <react|vue> --port <port>` — scaffold a new remote and wire it to the shell.
- `mfe graph` — print dependency graph (shell/remotes, status, framework icons).
- `mfe deps --check` — check shared dependency versions; `--sync` planned.

## Notes
- `--filter` matches workspace package name (e.g., `@basic/counter`).
- Ports are required for `mfe add`; ensure uniqueness.
- All commands assume the repo root (where `turbo.json` lives).
