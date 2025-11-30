# create-mfe-stack

<div align="center">
  <h1>🏗️ create-mfe-stack</h1>
  <p><strong>Scaffold production-ready micro-frontend architectures with zero config</strong></p>
  
  <p>
    <a href="https://www.npmjs.com/package/create-mfe-stack"><img src="https://img.shields.io/npm/v/create-mfe-stack.svg" alt="npm version"></a>
    <a href="https://github.com/riyajahamedi/create-mfe-stack/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/create-mfe-stack.svg" alt="license"></a>
    <a href="https://github.com/riyajahamedi/create-mfe-stack/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  </p>
</div>

---

## ✨ Why create-mfe-stack?

Building a micro-frontend architecture from scratch is complex. You need to:
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
├── turbo.json          # Turborepo configuration
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
| Multiple Frameworks | ✅ | N/A | Limited |
| Interactive Setup | ✅ | ❌ | Varies |

## 🗺️ Roadmap

- [x] Phase 1: CLI scaffolding with React templates
- [x] Phase 2: Vue templates
- [x] Phase 3: Runtime orchestration package (@mfe-stack/core)
- [ ] Phase 4: Dev commands (@mfe-stack/cli)
- [ ] Phase 5: Design system starter
- [ ] Phase 6: State management integration
- [ ] Phase 7: Plugin system

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/riyajahamedi/create-mfe-stack.git
cd create-mfe-stack

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

## 📄 License

MIT © [create-mfe-stack](https://github.com/riyajahamedi/create-mfe-stack)

---

<div align="center">
  <p>Made with ❤️ for the micro-frontend community</p>
</div>