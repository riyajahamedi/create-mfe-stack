# Getting Started

This guide will help you create your first micro-frontend platform using `create-mfe-stack`.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (recommended) or npm/yarn

## Quick Start

Run the following command to create a new micro-frontend platform:

```bash
npx create-mfe-stack@latest my-platform
```

Or with pnpm:

```bash
pnpm create mfe-stack my-platform
```

## Interactive Setup

The CLI will guide you through the setup process:

### 1. Project Name

Enter your project name. This will be used as the directory name and in package.json.

### 2. Project Type

Choose what you want to create:

- **Complete Platform**: Full setup with shell and remote applications
- **Shell Only**: Just the host application that loads remotes
- **Remote Only**: A standalone micro-frontend app

### 3. Framework

Select your preferred framework:

- **React**: React 18 with TypeScript
- **Vue**: Vue 3 with TypeScript

### 4. Features

Select optional features to include:

- **Shared State Management**: Cross-MFE state sharing
- **Design System Starter**: Shared component library
- **GitHub Actions CI/CD**: Automated testing and deployment
- **Docker Configuration**: Containerization setup

### 5. Package Manager

Choose your package manager:

- **pnpm** (recommended)
- npm
- yarn

## After Setup

Once the setup is complete:

```bash
cd my-platform
pnpm install
pnpm dev
```

Your micro-frontend platform will be running at:

- **Shell**: http://localhost:3000
- **Remote 1**: http://localhost:3001

## Project Structure

```
my-platform/
├── apps/
│   ├── shell/          # Host application
│   └── remote1/        # Remote micro-frontend
├── packages/           # Shared packages
├── turbo.json          # Turborepo configuration
└── package.json        # Root package.json
```

## Next Steps

- Read the [Architecture Documentation](./architecture/adrs/001-monorepo-structure.md)
- Add more remotes using the CLI
- Set up shared packages
- Configure CI/CD for your platform

## Need Help?

- Check the [GitHub Issues](https://github.com/riyajahamedi/create-mfe-stack/issues)
- Read the [README](../README.md)
- Join the community discussions
