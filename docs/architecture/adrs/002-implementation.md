# create-mfe-stack Project Technical Roadmap & Publishing Guide

This document summarizes all major decisions, actions, pull requests, and automation details for the create-mfe-stack repository. Use this as reference for onboarding, handoff, OSS advocacy, or simply tracking your progress!

---

## 🚀 Project Purpose

**create-mfe-stack** is a CLI tool to scaffold production-ready micro-frontend architectures with zero config. It gives developers a complete, modern monorepo using Turborepo, pnpm workspaces, Vite, and Module Federation, plus type-safe state sharing, dev tools, and unified CLI commands for day-to-day development.

---

## 📅 Milestone Sequence

### 1. Monorepo Foundation  
- Empty repo initialized
- CLI package skeleton (`create-mfe-stack`)
- Core and CLI placeholders (`@mfe-stack/core`, `@mfe-stack/cli`)
- Turborepo & pnpm configuration
- First README, LICENSE, .github workflows, and templates

### 2. Fully Implemented CLI  
- Interactive @clack/prompts wizard for project type, framework, features
- Real scaffolding logic to generate monorepo, shell, remotes, and templates

### 3. Add Vue Templates  
- `shell-vue` and `remote-vue` templates using Vite + Federation
- CLI prompting supports React or Vue

### 4. Cross-MFE State Bridge  
- `@mfe-stack/core` implements pub/sub state bridge with Zod validation
- `@mfe-stack/react` and `@mfe-stack/vue` for typed hooks/composables
- 44+ tests for reliability

### 5. Dev Commands via Unified CLI  
- `@mfe-stack/cli` and `mfe` commands
    - `mfe dev`: start all dev servers
    - `mfe build`: build all apps
    - `mfe add <name>`: scaffold new remote app
    - `mfe graph`: show architecture visually
    - `mfe deps`: check/sync shared deps

### 6. DevTools Browser Extension  
- `@mfe-stack/devtools` (Chrome/Firefox)
- Detects MFE bridges/state/event bus in runtime
- Devtools panel with tabs for Graph, State Inspector, Events, Remotes, Metrics (with dark theme)
- React-based UI, Chrome Manifest V3

---

## 📦 Packages & Structure

- `packages/create-mfe-stack`: Main CLI (scaffolding tool)
- `packages/@mfe-stack/core`: Type-safe state bridge
- `packages/@mfe-stack/react`: React hooks for bridge
- `packages/@mfe-stack/vue`: Vue composables for bridge
- `packages/@mfe-stack/cli`: Dev CLI for unified commands
- `packages/@mfe-stack/devtools`: Browser DevTools extension

---

## 🛠 Technical Practices

- **TypeScript** everywhere for DX and safety
- **pnpm workspaces** and **Turborepo** for monorepo foundation
- **EJS templates** for flexible project generation
- **commander**/**@clack/prompts** for comfortable CLI UX
- **Vitest** and **Zod** for reliable and type-safe tests
- Extensions and CLI all use **React**, styled for dark mode and modern look
- **All user-facing tools support both React and Vue MFEs**

---

## ⚡ Publishing All Packages on npm

### Prerequisites

- NPM account & [automation token](https://www.npmjs.com/settings/USERNAME/tokens)
- Add `NPM_TOKEN` as a secret in your GitHub repo at  
  _Settings → Secrets → Actions → `NPM_TOKEN`_

### CI/CD Workflows Overview

| Workflow | Trigger | What Happens |
|----------|---------|--------------|
| `ci.yml` | Every push/PR to `main` | Builds + tests only (no publish) |
| `publish.yml` | Push a `v*` tag | Publishes all packages to npm |
| `release.yml` | Push to `main` | Creates "Version Packages" PR if changesets exist |

> **Note:** Publishing only happens when you explicitly push a tag OR merge the "Version Packages" PR. Regular pushes to main do NOT auto-publish.

---

### Option 1: Tag-based Publishing (Simple)

Best for: Initial releases, hotfixes, quick alpha/beta releases.

```bash
# 1. Commit your changes
git add .
git commit -m "feat: your changes"
git push origin main

# 2. Create and push a version tag
git tag v0.1.0-alpha.1
git push origin v0.1.0-alpha.1
# → Triggers publish.yml → Publishes to npm
```

---

### Option 2: Changesets (Recommended for Long-term)

Best for: Ongoing development, multiple contributors, automatic changelogs.

**Workflow:**
```
Developer makes changes
       ↓
pnpm changeset (describes what changed)
       ↓
PR merged to main
       ↓
release.yml creates "Version Packages" PR
(auto-bumps versions + generates CHANGELOG)
       ↓
Maintainer reviews & merges Version PR
       ↓
Packages published to npm automatically
```

**Commands:**
```bash
# 1. After making changes, create a changeset
pnpm changeset
# Select packages, choose bump type (patch/minor/major), add summary

# 2. Commit the changeset with your changes
git add .
git commit -m "feat: your changes"
git push origin main

# 3. GitHub Actions creates a "Version Packages" PR
# 4. Review and merge that PR to publish
```

**Why Changesets is better long-term:**
- Auto-generates CHANGELOG.md per package
- Handles version bumps automatically
- Contributors document changes as they go
- Manages inter-package dependencies

---

### Manual Publishing Steps

For local testing or emergency releases:

1. cd into each package (`packages/create-mfe-stack`, etc.)
2. Set `"version": "0.1.0-alpha.1"` in each `package.json`
3. Build everything  
   ```bash
   pnpm install
   pnpm build
   ```
4. Publish all non-private packages  
   ```bash
   npm publish --access public --tag alpha
   ```

### Automated Publishing via GitHub Actions

The repository has three workflows configured:

#### `.github/workflows/ci.yml` - Continuous Integration
```yaml
# Runs on every push/PR to main
# Builds and tests all packages
# Does NOT publish anything
```

#### `.github/workflows/publish.yml` - Tag-based Publishing
```yaml
name: Publish
on:
  push:
    tags:
      - 'v*'
# Publishes all non-private packages when you push a v* tag
```

#### `.github/workflows/release.yml` - Changesets Automation
```yaml
name: Release
on:
  push:
    branches:
      - main
# Creates "Version Packages" PR when changesets are merged
# Publishes to npm when that PR is merged
```

- **Tag your release** (for tag-based approach):
   ```bash
   git tag v0.1.0-alpha.1
   git push origin v0.1.0-alpha.1
   ```

- This pipeline publishes all public packages unless `"private": true` is set.

---

## 🏗 Example CLI/DevTools Usage

**Scaffold a new platform:**
```bash
npx create-mfe-stack my-platform
# Prompts for framework, features, remotes, etc.
cd my-platform
pnpm install
pnpm dev
```

**Add a remote:**
```bash
mfe add checkout --framework=vue --port=3002
pnpm install
mfe dev
```

**Visualize dependencies:**
```bash
mfe graph
```

**Debug MFEs:**
- Load the browser extension as “unpacked” in Chrome, open DevTools, use “MFE Stack” tab.

---

## ✅ OSS & Best Practices Reference

- All PRs merge through GitHub Actions, never directly to main
- Each PR describes architectural choices (monorepo, Vite, Zod vs alternatives, UX tradeoffs)
- README is updated with accurate install and feature instructions after each phase
- Extension is optionally private—do not publish unless intended!

---

## 🗂️ Next Steps & Notes

- Update README/Contributing with “How to Release” and “Publishing” sections with these steps.
- For private enterprise use, customize tags, access fields, and registry config.
- For a public launch, push a stable tag (`v1.0.0`) and set `"latest"` tag on npm.

---

**This document should be kept with your repo’s ADRs and onboarding docs. Future contributors can follow this as a step-by-step changelog, technical guide, and reference for how to maintain and ship micro-frontend architectures with create-mfe-stack!**