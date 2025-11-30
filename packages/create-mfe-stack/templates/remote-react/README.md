# Remote Application

This is a remote micro-frontend that exposes components to be consumed by the shell application.

## Features

- Module Federation remote configuration
- Exposes App component
- Standalone development mode
- TypeScript enabled

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Exposed Modules

- `./App` - Main App component

## How Module Federation Works

This remote application exposes components via the `remoteEntry.js` file generated during build. The shell application can then load these components dynamically at runtime.
