# Examples Plan

This document outlines the example applications to showcase `create-mfe-stack` capabilities.

## Overview

| Example | Purpose | Frameworks | Complexity |
|---------|---------|------------|------------|
| Basic | Quick start, minimal setup | React + React | ⭐ |
| Multi-Framework | Cross-framework state sharing | React + Vue | ⭐⭐ |
| E-commerce Dashboard | Real-world use case | React + Vue + React | ⭐⭐⭐ |

---

## Example 1: Basic

**Goal:** Demonstrate the simplest MFE setup with shared state.

### Structure
```
examples/basic/
├── apps/
│   ├── shell/          # React shell (port 3000)
│   └── counter/        # React remote (port 3001)
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Features to Demonstrate
- [x] Shell loading a remote MFE
- [x] Shared counter state between shell and remote
- [x] `useBridge` and `useBridgeState` hooks
- [x] Live state sync (update in one, reflects in other)

### Shared State Schema
```typescript
import { z } from 'zod';

const stateSchema = z.object({
  count: z.number().default(0),
  lastUpdatedBy: z.enum(['shell', 'counter']).optional(),
});
```

### User Flow
1. Shell displays current count and "Increment" button
2. Counter remote displays same count with "Decrement" button
3. Clicking either button updates state in both apps instantly

### Commands to Create
```bash
npx create-mfe-stack basic --template monorepo
cd basic
pnpm mfe add counter --type remote --framework react
```

---

## Example 2: Multi-Framework (Priority for Reddit)

**Goal:** Showcase React + Vue working together with shared state - the key differentiator.

### Structure
```
examples/multi-framework/
├── apps/
│   ├── shell/          # React shell (port 3000)
│   ├── cart/           # Vue remote - shopping cart (port 3001)
│   └── products/       # React remote - product list (port 3002)
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Features to Demonstrate
- [x] React shell hosting Vue and React remotes
- [x] Shared shopping cart state across frameworks
- [x] `@mfe-stack/react` hooks in shell/products
- [x] `@mfe-stack/vue` composables in cart
- [x] Add to cart from React, view cart in Vue
- [x] Real-time cart count in shell header

### Shared State Schema
```typescript
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const stateSchema = z.object({
  cart: z.array(productSchema).default([]),
  user: z.object({
    name: z.string(),
    isLoggedIn: z.boolean(),
  }).optional(),
  theme: z.enum(['light', 'dark']).default('light'),
});
```

### User Flow
1. Shell shows header with cart count badge (React)
2. Products remote displays product grid with "Add to Cart" buttons (React)
3. Cart remote shows cart items with quantity controls (Vue)
4. Adding product in React updates Vue cart instantly
5. Removing from Vue cart updates React shell badge

### UI Components

**Shell (React)**
- Header with logo, navigation, cart icon with badge
- Main content area loading remotes
- Theme toggle (light/dark)

**Products Remote (React)**
- Grid of 6 sample products
- Each card: image, name, price, "Add to Cart" button
- Uses `useBridgeAction` to dispatch ADD_TO_CART

**Cart Remote (Vue)**
- List of cart items
- Quantity +/- buttons
- Remove item button
- Cart total calculation
- Uses `useBridgeState('cart')` for reactive updates

### Reddit Post Assets
- [ ] GIF: Adding product in React, appearing in Vue cart
- [ ] GIF: Theme toggle affecting all MFEs
- [ ] Screenshot: Architecture diagram
- [ ] Code snippets: React hook vs Vue composable side-by-side

---

## Example 3: E-commerce Dashboard

**Goal:** Production-like dashboard showcasing scalable architecture.

### Structure
```
examples/dashboard/
├── apps/
│   ├── shell/          # React shell with layout (port 3000)
│   ├── analytics/      # React remote - charts/stats (port 3001)
│   ├── products/       # Vue remote - product management (port 3002)
│   ├── orders/         # React remote - order list (port 3003)
│   └── settings/       # Vue remote - user settings (port 3004)
├── packages/
│   └── ui/             # Shared UI components
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Features to Demonstrate
- [x] Multiple remotes with lazy loading
- [x] Shared UI component library
- [x] Complex state: user, notifications, permissions
- [x] Navigation between MFEs
- [x] Error boundaries for MFE failures
- [x] Loading states

### Shared State Schema
```typescript
import { z } from 'zod';

const stateSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['admin', 'manager', 'viewer']),
    avatar: z.string().optional(),
  }).nullable(),
  
  notifications: z.array(z.object({
    id: z.string(),
    type: z.enum(['info', 'warning', 'error', 'success']),
    message: z.string(),
    read: z.boolean(),
    timestamp: z.number(),
  })).default([]),
  
  sidebar: z.object({
    collapsed: z.boolean().default(false),
  }),
  
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});
```

### User Flow
1. Login screen (mocked auth)
2. Dashboard with sidebar navigation
3. Click "Analytics" → loads analytics MFE
4. Click "Products" → loads Vue product management
5. Notification appears → badge updates in header
6. Toggle sidebar collapse → persists across navigation

---

## Implementation Order

### Day 1: Multi-Framework Example (Reddit Priority)
1. [ ] Scaffold with `create-mfe-stack`
2. [ ] Set up shell with header layout
3. [ ] Create products remote (React)
4. [ ] Create cart remote (Vue)
5. [ ] Implement shared cart state
6. [ ] Add theme toggle
7. [ ] Style with Tailwind CSS
8. [ ] Record GIFs for Reddit

### Day 2: Basic Example
1. [ ] Scaffold minimal setup
2. [ ] Implement counter state
3. [ ] Write beginner-friendly README
4. [ ] Add step-by-step tutorial

### Day 3: Dashboard Example
1. [ ] Scaffold with multiple remotes
2. [ ] Implement shared UI package
3. [ ] Add navigation and lazy loading
4. [ ] Implement auth state
5. [ ] Add notifications system
6. [ ] Polish and document

---

## Reddit Post Plan

### Title Options
1. "I built a CLI to scaffold Micro-Frontends with React + Vue sharing state - no iframe hacks"
2. "create-mfe-stack: Type-safe micro-frontend scaffolding with cross-framework state management"
3. "Sharing state between React and Vue micro-frontends made simple"

### Subreddits
- r/reactjs
- r/vuejs
- r/javascript
- r/webdev
- r/Frontend

### Post Content Structure
1. **Hook**: "What if your React shell could share state with Vue micro-frontends?"
2. **Problem**: MFE state management is painful, especially cross-framework
3. **Solution**: Introduce create-mfe-stack
4. **Demo GIF**: Show React ↔ Vue state sync
5. **Key Features**: 
   - One command setup: `npx create-mfe-stack my-app`
   - Type-safe with Zod validation
   - Framework agnostic core
   - React hooks + Vue composables
6. **Links**: GitHub, npm, examples
7. **Ask**: "What features would you want to see?"

### Timing
- Best time to post: Tuesday-Thursday, 9 AM EST
- Cross-post with 1-2 hour gaps

---

## File Checklist

Each example needs:
- [ ] `README.md` with setup instructions
- [ ] `screenshot.png` or `demo.gif`
- [ ] Comments in code explaining key concepts
- [ ] Working `pnpm dev` command
- [ ] Clear folder structure
