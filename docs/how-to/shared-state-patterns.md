# Shared state patterns

Patterns for bridges and helpers you can copy.

## Counter
- Schema: `count: number`, `lastUpdatedBy?: 'shell' | 'remote'`.
- Helpers: `increment(source)`, `decrement(source)`.
- UI: `useBridgeState(counterBridge, 'count')` in both shell and remote.

## Cart
- Schema: `cart: product[]`, `theme: 'light' | 'dark'`.
- Helpers: `addToCart`, `updateQuantity`, `removeItem`, `toggleTheme`.
- Pattern: Mutate quantities immutably and validate with Zod defaults.

## Auth (mocked)
- Schema: `user: { id, name, role } | null`, `token?: string`.
- Helpers: `signIn(payload)`, `signOut()`, `updateProfile(partial)`.
- Tip: Never store real tokens in the bridge; keep demo-only.

## Notifications
- Schema: `notifications: { id, type, message, read, timestamp }[]`.
- Helpers: `pushNotification`, `markRead(id)`, `clearAll()`.
- Tip: Cap list length to avoid unbounded growth.

## Theme
- Schema: `theme: 'light' | 'dark' | 'system'`.
- Helper: `setTheme(value)`; consider persisting via `createStore({ persist: true })`.

## Validation tips
- Use Zod defaults so empty `initialState` is valid.
- Guard payloads in action handlers to avoid invalid writes.
- Keep schemas per domain; avoid mega-schemas shared by everything.
