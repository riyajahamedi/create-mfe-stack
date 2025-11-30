# ADR 001: Monorepo Structure

## Status

Accepted

## Date

2024-01-01

## Context

We need to decide on the architecture and tooling for the `create-mfe-stack` CLI tool. This includes:

1. How to structure the monorepo
2. Which build tool to use for the CLI
3. Which template bundler to use for generated projects
4. What CLI UX library to use

## Decision

### Monorepo: pnpm + Turborepo

**Choice**: pnpm workspaces with Turborepo

**Alternatives Considered**:
- npm workspaces + Lerna
- yarn workspaces + Nx

**Rationale**:
- **pnpm**: Disk space efficient, strict dependency management, excellent monorepo support
- **Turborepo**: Fast incremental builds, minimal configuration, caching, parallel execution
- Simple setup with `pnpm-workspace.yaml` and `turbo.json`
- Excellent DX with clear task dependencies

### Template Bundler: Vite

**Choice**: Vite with `@originjs/vite-plugin-federation`

**Alternatives Considered**:
- Webpack 5 with native Module Federation
- Rspack

**Rationale**:
- Vite offers significantly faster development builds (instant HMR)
- Better DX with minimal configuration
- The `@originjs/vite-plugin-federation` plugin provides full Module Federation support
- Smaller learning curve for new developers
- Native ES modules support

### CLI UX: @clack/prompts

**Choice**: `@clack/prompts` for interactive CLI

**Alternatives Considered**:
- Inquirer.js
- Prompts
- Enquirer

**Rationale**:
- Beautiful, modern UI out of the box
- Spinners, progress bars, and styled output included
- Excellent TypeScript support
- Lightweight (~10KB)
- Works seamlessly with `picocolors` for styling

### Build Tool: tsup

**Choice**: tsup for building the CLI package

**Rationale**:
- Zero-config TypeScript bundling
- Built on esbuild for fast builds
- ESM and CJS output support
- DTS generation

## Consequences

### Positive
- Fast development and build times
- Minimal configuration overhead
- Modern tooling with active maintenance
- Great developer experience

### Negative
- Vite Module Federation is community-maintained (not official Vite plugin)
- pnpm may have slightly steeper learning curve for npm users

### Risks
- `@originjs/vite-plugin-federation` compatibility with future Vite versions
- Mitigation: Monitor the plugin's development and have fallback to Webpack

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vite Documentation](https://vitejs.dev/)
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
- [@clack/prompts](https://github.com/natemoo-re/clack)
