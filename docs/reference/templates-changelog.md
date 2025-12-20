# Templates changelog

Use this file to record template updates so existing projects can cherry-pick changes.

## How to consume updates
- Compare your generated project with the templates in `packages/create-mfe-stack/templates`.
- For new releases, diff tags or npm versions of `create-mfe-stack` to copy only needed files.
- Note breaking changes (renamed remotes, new env vars, shared dependency changes) here.

## 0.2.0 (current baseline)
- Base monorepo with `pnpm-workspace.yaml`, `turbo.json`, root lint/build scripts.
- Shell templates (React/Vue) using Vite + module federation host setup with a starter remote entry.
- Remote templates (React/Vue) exposing `./App` with minimal UI demo.
- CLI options for complete platform (shell + first remote), shell only, or remote only.

_Add new releases below this line._
