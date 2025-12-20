# Bridge and Store

Core building blocks for cross-MFE communication.

## Bridge
- Purpose: typed, shared state with actions and subscriptions.
- Create: `createBridge({ namespace, schema, initialState })` where `schema` is a Zod object.
- Read: `bridge.getState()`.
- Write: `bridge.setState(partial | updaterFn)`; validated against the schema.
- Subscribe: `bridge.subscribe((state, prev) => ...)` or `bridge.subscribeKey('key', (value, prev) => ...)`.
- Actions: `bridge.dispatch('ACTION', payload)` + `bridge.onAction('ACTION', handler)`.
- Devtools: automatically registers when the devtools extension is present.

### Patterns
- Keep schemas small and cohesive (cart, auth, theme separately if needed).
- Prefer actions for domain events (`ADD_TO_CART`, `THEME_TOGGLED`) and `setState` for persistence.
- Use defaults in Zod schemas to allow empty `initialState`.
- Co-locate bridges in a shared package so all MFEs import the same instance.

## Store
- Purpose: key/value store with optional persistence; lighter than a bridge.
- Create: `createStore({ persist?: boolean, key?: string })`.
- API: `get`, `set`, `delete`, `clear`, `subscribe(key, listener)`.
- Use cases: feature flags, small preferences, local session data.

## Error Handling
- Schema validation failures throw; catch around `setState` if updating from untrusted input.
- Action handlers should guard against bad payloads.
- Persisted store data is best-effort; invalid JSON is ignored on load.

## Performance Tips
- Use `subscribeKey`/`useBridgeState` to minimize renders.
- Avoid storing large blobs; store IDs and fetch details per MFE if needed.
- Keep namespaces unique per logical domain (`cart`, `auth`, `theme`).
