# create-mfe-stack

<div align="center">
  <h1>🏗️ create-mfe-stack</h1>
  <p><strong>Scaffold production-ready micro-frontend architectures with zero config</strong></p>
  
  <p>
    <a href="https://www.npmjs.com/package/create-mfe-stack"><img src="https://img.shields.io/npm/v/create-mfe-stack.svg" alt="npm version"></a>
    <a href="https://github.com/riyajahamedi/create-mfe-stack/blob/main/LICENSE"><img src="https://img.shields. io/npm/l/create-mfe-stack. svg" alt="license"></a>
    <a href="https://github.com/riyajahamedi/create-mfe-stack/pulls"><img src="https://img.shields. io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  </p>
</div>

---

## ✨ Why create-mfe-stack?

Building a micro-frontend architecture from scratch is complex.  You need to:
- Set up Module Federation correctly
- Configure multiple applications to work together
- Ensure shared dependencies don't conflict
- Handle routing, state, and communication between MFEs

**create-mfe-stack** gives you all of this in a single command. 

## 🚀 Quick Start

```bash
npx create-mfe-stack@latest my-platform
```

Or with pnpm:

```bash
pnpm create mfe-stack my-platform
```

Follow the interactive prompts and you'll have a complete micro-frontend platform running in minutes!

## 🎯 Features

- 🏢 **Monorepo Ready** - Turborepo + pnpm workspaces pre-configured
- ⚡ **Blazing Fast** - Vite-powered development and builds
- 🔗 **Module Federation** - Pre-configured host/remote architecture
- 📦 **Zero Config** - Works out of the box
- 🎨 **Framework Flexibility** - React or Vue (more coming soon)
- 🔧 **TypeScript First** - Full TypeScript support
- 📋 **Best Practices** - Production-ready templates

## 📖 What's Generated

When you run `create-mfe-stack`, you get:

```
my-platform/
├── apps/
│   ├── shell/          # Host application (port 3000)
│   └── remote1/        # Remote micro-frontend (port 3001)
├── packages/           # Shared packages
├── turbo. json          # Turborepo configuration
├── pnpm-workspace.yaml # Workspace configuration
└── package.json        # Root package.json
```

## 🛠️ CLI Options

The interactive wizard will guide you through:

1. **Project name** - Name of your platform
2. **Project type** - Complete platform, Shell only, or Remote only
3. **Framework** - React or Vue
4. **Features** - State management, design system, CI/CD, Docker
5. **Package manager** - pnpm (recommended), npm, or yarn

## 📊 Comparison with Other Tools

| Feature | create-mfe-stack | Manual Setup | Other CLIs |
|---------|-----------------|--------------|------------|
| Zero Config | ✅ | ❌ | Partial |
| Module Federation | ✅ | Manual | Varies |
| Turborepo Integration | ✅ | Manual | ❌ |
| TypeScript | ✅ | Manual | Varies |

---

## 🧑‍💻 Running Locally (Contributing to create-mfe-stack)

Want to contribute or run the CLI locally for development?  Follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0. 0
- **pnpm** >= 9.0.0

### Installation

1. **Fork & Clone the repository**

   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/create-mfe-stack. git
   cd create-mfe-stack
   ```

2. **Add upstream remote** (to keep your fork in sync)

   ```bash
   git remote add upstream https://github.com/riyajahamedi/create-mfe-stack.git
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Build all packages**

   ```bash
   pnpm build
   ```

5. **Run in development mode**

   ```bash
   pnpm dev
   ```

### Project Structure

```
create-mfe-stack/
├── packages/
│   ├── create-mfe-stack/     # Main CLI package (scaffolding tool)
│   │   ├── src/              # CLI source code
│   │   └── templates/        # Project templates (React/Vue)
│   ├── @mfe-stack/core/      # Runtime orchestrator
│   └── @mfe-stack/cli/       # Development commands (mfe dev, mfe add, etc.)
├── pnpm-workspace. yaml       # Workspace configuration
├── turbo. json                # Turborepo configuration
└── package.json              # Root package.json
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build all packages using Turborepo |
| `pnpm dev` | Run all packages in development mode |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run tests across all packages |
| `pnpm clean` | Clean all build artifacts and node_modules |
| `pnpm format` | Format code with Prettier |

### Testing Your Changes

After making changes to the CLI, you can test it locally:

```bash
# Build the packages first
pnpm build

# Test the CLI by running it from the packages directory
node packages/create-mfe-stack/dist/index.js my-test-project
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Making Changes

1. **Create a new branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3.  **Run linting and tests**:

   ```bash
   pnpm lint
   pnpm test
   ```

4. **Build the project**:

   ```bash
   pnpm build
   ```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

| Prefix | Description |
|--------|-------------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, etc.) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

**Examples:**

```bash
git commit -m "feat: add Vue template support"
git commit -m "fix: resolve path resolution on Windows"
git commit -m "docs: update getting started guide"
```

### Pull Request Process

1.  Update documentation if needed
2.  Ensure all tests pass
3. Update the CHANGELOG. md if applicable
4. Create a pull request with a clear title and description
5. Wait for review and address any feedback

**PR Title Format:** Use the same format as commit messages:

```
feat: add support for custom templates
```

---

## 📚 Additional Commands

Once you've scaffolded a project, you can use the `@mfe-stack/cli` commands:

```bash
# Start development server for all apps
mfe dev

# Add a new remote micro-frontend
mfe add dashboard --framework=react --port=3002

# Visualize your MFE architecture
mfe graph

# Check for dependency conflicts
mfe deps --check
```

---

## ❓ Questions?

If you have questions, feel free to:

- 🐛 [Open an issue](https://github.com/riyajahamedi/create-mfe-stack/issues)
- 💬 [Start a discussion](https://github.com/riyajahamedi/create-mfe-stack/discussions)
- 📖 Check existing issues for similar questions

---

## 📄 License

[MIT](./LICENSE) © create-mfe-stack

---

<div align="center">
  <p>Made with ❤️ for the micro-frontend community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>