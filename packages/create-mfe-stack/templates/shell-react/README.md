# Shell Application

This is the host (shell) application that orchestrates and loads remote micro-frontends.

## Features

- Module Federation host configuration
- Dynamic remote loading with Suspense
- Basic layout structure (header, main, footer)
- TypeScript enabled

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## How Module Federation Works

The shell application loads remote components at runtime using Vite's Module Federation plugin. The remote components are loaded from their respective URLs configured in `vite.config.ts`.
