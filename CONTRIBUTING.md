# Contributing to create-mfe-stack

Thank you for your interest in contributing to create-mfe-stack! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and inclusive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/create-mfe-stack.git
   cd create-mfe-stack
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/riyajahamedi/create-mfe-stack.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

### Project Structure

```
create-mfe-stack/
├── packages/
│   ├── create-mfe-stack/    # Main CLI package
│   ├── @mfe-stack/core/     # Runtime orchestrator
│   └── @mfe-stack/cli/      # Dev commands
├── templates/                # EJS templates for scaffolding
├── docs/                     # Documentation
└── turbo.json               # Turborepo configuration
```

## Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Run linting and tests:
   ```bash
   pnpm lint
   pnpm test
   ```
4. Build the project:
   ```bash
   pnpm build
   ```

## Commit Guidelines

We follow conventional commits for our commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add Vue template support
fix: resolve path resolution on Windows
docs: update getting started guide
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the CHANGELOG.md if applicable
4. Create a pull request with a clear title and description
5. Wait for review and address any feedback

### PR Title Format

Use the same format as commit messages:
```
feat: add support for custom templates
```

## Questions?

If you have questions, feel free to:
- Open a discussion on GitHub
- Check existing issues for similar questions

Thank you for contributing! 🎉
