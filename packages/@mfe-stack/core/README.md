# @mfe-stack/core

Type-safe state bridge for micro-frontend communication.

## Installation

```bash
npm install @mfe-stack/core zod
```

Or with pnpm:

```bash
pnpm add @mfe-stack/core zod
```

## Features

- 🔒 **Type-safe** - Full TypeScript support with Zod schema validation
- 🔄 **Reactive** - Subscribe to state changes with fine-grained listeners
- 📡 **Event Bus** - Lightweight pub/sub for one-off events
- 💾 **Persistent Store** - Optional localStorage persistence
- 🎯 **Framework Agnostic** - Works with React, Vue, or vanilla JS
- 🧹 **Cleanup** - Proper cleanup with unsubscribe functions

## Usage

### Create a Bridge

Use `createBridge` to create a type-safe state container that can be shared across micro-frontends:

```typescript
import { createBridge } from '@mfe-stack/core';
import { z } from 'zod';

// Define your schema
const CartSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
  })),
  total: z.number(),
});

// Create the bridge
export const cartBridge = createBridge({
  namespace: 'cart',
  schema: CartSchema,
  initialState: { items: [], total: 0 },
});
```

### Update State

```typescript
// Partial update
cartBridge.setState({ total: 100 });

// Functional update
cartBridge.setState((prev) => ({
  total: prev.total + 50,
}));

// Add items
cartBridge.setState((prev) => ({
  items: [...prev.items, { id: '1', name: 'Product', quantity: 1 }],
  total: prev.total + 25,
}));
```

### Subscribe to Changes

```typescript
// Subscribe to all changes
const unsubscribe = cartBridge.subscribe((state, prevState) => {
  console.log('Cart updated:', state);
});

// Subscribe to specific key
const unsubscribeItems = cartBridge.subscribeKey('items', (items, prevItems) => {
  console.log('Items changed:', items);
});

// Cleanup when done
unsubscribe();
unsubscribeItems();
```

### Dispatch Actions

For more complex state updates, use actions:

```typescript
// Listen for actions
cartBridge.onAction('ADD_ITEM', (payload) => {
  const { id, name, price } = payload as { id: string; name: string; price: number };
  cartBridge.setState((prev) => ({
    items: [...prev.items, { id, name, quantity: 1 }],
    total: prev.total + price,
  }));
});

// Dispatch action from anywhere
cartBridge.dispatch('ADD_ITEM', { id: '1', name: 'Widget', price: 25 });
```

### Use in React

Install the React integration:

```bash
pnpm add @mfe-stack/react
```

```tsx
import { useBridgeState } from '@mfe-stack/react';
import { cartBridge } from '@my-platform/shared';

function CartIcon() {
  const items = useBridgeState(cartBridge, 'items');
  return <span>Cart ({items.length})</span>;
}

function CartTotal() {
  const total = useBridgeState(cartBridge, 'total');
  return <span>Total: ${total}</span>;
}
```

### Use in Vue

Install the Vue integration:

```bash
pnpm add @mfe-stack/vue
```

```vue
<script setup>
import { useBridgeState } from '@mfe-stack/vue';
import { cartBridge } from '@my-platform/shared';

const items = useBridgeState(cartBridge, 'items');
const total = useBridgeState(cartBridge, 'total');
</script>

<template>
  <div>
    <span>Cart ({{ items.length }})</span>
    <span>Total: ${{ total }}</span>
  </div>
</template>
```

### Event Bus

For one-off events that don't need persistent state:

```typescript
import { createEventBus } from '@mfe-stack/core';

const bus = createEventBus();

// Subscribe to events
const unsubscribe = bus.on('user:login', (user) => {
  console.log('User logged in:', user);
});

// Emit events
bus.emit('user:login', { id: '123', name: 'John' });

// One-time listener
bus.once('app:ready', () => {
  console.log('App is ready!');
});

// Cleanup
unsubscribe();
```

### Persistent Store

For simple key-value storage with optional persistence:

```typescript
import { createStore } from '@mfe-stack/core';

interface AppStore {
  user: { id: string; name: string } | null;
  theme: 'light' | 'dark';
}

const store = createStore<AppStore>({
  persist: true,  // Enable localStorage persistence
  key: '@my-app/store',  // Custom storage key
});

// Set values
store.set('user', { id: '123', name: 'John' });
store.set('theme', 'dark');

// Get values
const user = store.get('user');
const theme = store.get('theme');

// Subscribe to changes
const unsubscribe = store.subscribe('theme', (theme) => {
  document.body.classList.toggle('dark', theme === 'dark');
});

// Delete and clear
store.delete('user');
store.clear();
```

## API Reference

### `createBridge(config)`

Creates a type-safe state bridge.

**Config:**
- `namespace: string` - Unique identifier for the bridge
- `schema: ZodType` - Zod schema for state validation
- `initialState?: T` - Initial state (optional)

**Returns:** `Bridge<T>`

### `Bridge<T>`

- `getState(): T` - Get current state
- `setState(updater)` - Update state with partial object or function
- `subscribe(listener)` - Subscribe to all state changes
- `subscribeKey(key, listener)` - Subscribe to specific key changes
- `dispatch(action, payload)` - Dispatch an action
- `onAction(action, handler)` - Listen for actions
- `destroy()` - Cleanup and destroy the bridge

### `createEventBus()`

Creates a lightweight event bus.

**Returns:** `EventBus`

### `EventBus`

- `emit(event, payload?)` - Emit an event
- `on(event, handler)` - Subscribe to an event
- `once(event, handler)` - Subscribe for a single event
- `off(event, handler?)` - Remove handler(s)

### `createStore(config?)`

Creates a simple key-value store.

**Config:**
- `persist?: boolean` - Enable localStorage persistence
- `key?: string` - Storage key (default: `@mfe-stack/store`)

**Returns:** `Store<T>`

### `Store<T>`

- `get(key)` - Get a value
- `set(key, value)` - Set a value
- `delete(key)` - Delete a value
- `clear()` - Clear all values
- `subscribe(key, listener)` - Subscribe to key changes

## License

MIT
