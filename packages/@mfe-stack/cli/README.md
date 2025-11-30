# @mfe-stack/cli

Development CLI for micro-frontend projects scaffolded with `create-mfe-stack`.

## Installation

```bash
# Install globally
npm install -g @mfe-stack/cli

# Or use with npx
npx @mfe-stack/cli <command>
```

## Commands

### `mfe dev` - Start Development Servers

Start all development servers in your micro-frontend project.

```bash
# Start all apps (shell + remotes)
mfe dev

# Start only a specific app
mfe dev --filter=shell
mfe dev --filter=remote1
```

**Options:**
- `-f, --filter <app>` - Filter to a specific app

### `mfe build` - Production Build

Build all applications for production deployment.

```bash
# Build all apps
mfe build

# Build a specific app
mfe build --filter=shell
```

**Options:**
- `-f, --filter <app>` - Filter to a specific app
- `--analyze` - Include bundle analysis (coming soon)

### `mfe add <name>` - Add New Remote

Scaffold a new remote micro-frontend and add it to your project.

```bash
# Interactive mode - prompts for framework and port
mfe add checkout

# Specify options directly
mfe add checkout --framework=react --port=3003
mfe add payments --framework=vue --port=3004
```

**Options:**
- `-f, --framework <framework>` - Framework to use (`react` or `vue`)
- `-p, --port <port>` - Port number for the development server

**What it does:**
1. Creates a new remote app in `apps/<name>/`
2. Generates all necessary files (vite.config.ts, package.json, etc.)
3. Updates the shell's vite.config.ts to include the new remote
4. Creates a basic component that's ready to use

### `mfe graph` - Dependency Graph

Visualize the dependency relationships between your micro-frontends.

```bash
mfe graph
```

**Output:**
```
  📊 MFE Dependency Graph

    ┌────────────────────┐
    │  SHELL :3000       │
    └─────────┬──────────┘
              │
              ├── ⚛️ remote1 :3001 ✓
              └── 🟢 checkout :3002 ✓

  Legend:
    ✓ Connected to shell
    ○ Not yet connected
    ⚛️ React  🟢 Vue
```

### `mfe deps` - Dependency Management

Check for version conflicts in shared dependencies across your micro-frontends.

```bash
# Check for version conflicts
mfe deps --check

# Sync versions (coming soon)
mfe deps --sync
```

**Options:**
- `-c, --check` - Check for version conflicts
- `-s, --sync` - Align shared dependency versions (coming soon)

**Monitored dependencies:**
- react, react-dom
- vue
- typescript
- vite
- @vitejs/plugin-react, @vitejs/plugin-vue
- @originjs/vite-plugin-federation

## Project Detection

The CLI automatically detects create-mfe-stack projects by looking for:
- A `turbo.json` file
- An `apps/` directory

It also auto-detects your package manager (pnpm, yarn, or npm) based on lock files.

## Examples

### Starting a New Project

```bash
# Scaffold a new project
npx create-mfe-stack my-platform

# Navigate to project
cd my-platform

# Start development
mfe dev
```

### Adding Remotes to an Existing Project

```bash
# Add a React remote
mfe add dashboard --framework=react --port=3002

# Add a Vue remote
mfe add settings --framework=vue --port=3003

# Install dependencies
pnpm install

# Start all apps
mfe dev
```

### Checking for Issues

```bash
# Visualize your architecture
mfe graph

# Check for dependency conflicts
mfe deps --check
```

## Requirements

- Node.js 18 or later
- pnpm, npm, or yarn
- A project scaffolded with `create-mfe-stack`

## License

MIT
