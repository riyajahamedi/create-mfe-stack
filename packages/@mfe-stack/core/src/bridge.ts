/**
 * Main bridge factory for cross-MFE communication.
 */

import { z } from 'zod';
import { getDevtoolsHook } from './devtools.js';

export interface BridgeConfig<T extends z.ZodType> {
  /**
   * Unique namespace for this bridge. Used for isolation between bridges.
   */
  namespace: string;

  /**
   * Zod schema for validating state.
   */
  schema: T;

  /**
   * Initial state. Must conform to the schema.
   */
  initialState?: z.infer<T>;
}

export interface Bridge<T> {
  /**
   * Get current state.
   */
  getState(): T;

  /**
   * Update state (partial updates supported).
   * @param updater - Partial state object or function that returns partial state
   */
  setState(updater: Partial<T> | ((prev: T) => Partial<T>)): void;

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   */
  subscribe(listener: (state: T, prevState: T) => void): () => void;

  /**
   * Subscribe to specific key changes. Returns an unsubscribe function.
   */
  subscribeKey<K extends keyof T>(
    key: K,
    listener: (value: T[K], prevValue: T[K]) => void
  ): () => void;

  /**
   * Dispatch a typed action.
   */
  dispatch<A extends string>(action: A, payload?: unknown): void;

  /**
   * Listen for actions. Returns an unsubscribe function.
   */
  onAction<P = unknown>(
    action: string,
    handler: (payload: P) => void
  ): () => void;

  /**
   * Destroy bridge and cleanup all listeners.
   */
  destroy(): void;
}

/**
 * Create a type-safe state bridge for cross-MFE communication.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { createBridge } from '@mfe-stack/core';
 *
 * const CartSchema = z.object({
 *   items: z.array(z.object({
 *     id: z.string(),
 *     name: z.string(),
 *     quantity: z.number(),
 *   })),
 *   total: z.number(),
 * });
 *
 * const cartBridge = createBridge({
 *   namespace: 'cart',
 *   schema: CartSchema,
 *   initialState: { items: [], total: 0 },
 * });
 *
 * // Update state
 * cartBridge.setState({ total: 100 });
 *
 * // Subscribe to changes
 * cartBridge.subscribe((state, prevState) => {
 *   console.log('Cart updated:', state);
 * });
 *
 * // Subscribe to specific key
 * cartBridge.subscribeKey('items', (items, prevItems) => {
 *   console.log('Items changed:', items);
 * });
 *
 * // Dispatch actions
 * cartBridge.dispatch('ADD_ITEM', { id: '1', name: 'Product', quantity: 1 });
 *
 * // Listen for actions
 * cartBridge.onAction('ADD_ITEM', (payload) => {
 *   // Handle action
 * });
 * ```
 */
export function createBridge<T extends z.ZodType>(
  config: BridgeConfig<T>
): Bridge<z.infer<T>> {
  type State = z.infer<T>;

  const { namespace, schema, initialState } = config;

  // Validate initial state
  let state: State;
  if (initialState !== undefined) {
    const result = schema.safeParse(initialState);
    if (!result.success) {
      throw new Error(
        `[${namespace}] Invalid initial state: ${result.error.message}`
      );
    }
    state = result.data;
  } else {
    // Try to create empty state from schema defaults
    const result = schema.safeParse({});
    if (!result.success) {
      throw new Error(
        `[${namespace}] No initial state provided and schema has no defaults: ${result.error.message}`
      );
    }
    state = result.data;
  }

  const stateListeners = new Set<(state: State, prevState: State) => void>();
  const keyListeners = new Map<
    keyof State,
    Set<(value: unknown, prevValue: unknown) => void>
  >();
  const actionHandlers = new Map<string, Set<(payload: unknown) => void>>();

  let isDestroyed = false;
  let actionCount = 0;

  // Register with devtools if available
  const devtools = getDevtoolsHook();
  let unregisterFromDevtools: (() => void) | null = null;
  if (devtools) {
    unregisterFromDevtools = devtools._internal.registerBridge({
      namespace,
      getState: () => state,
      actionCount: 0,
    });
  }

  function checkDestroyed(): void {
    if (isDestroyed) {
      throw new Error(`[${namespace}] Bridge has been destroyed`);
    }
  }

  function getState(): State {
    checkDestroyed();
    return state;
  }

  function setState(updater: Partial<State> | ((prev: State) => Partial<State>)): void {
    checkDestroyed();

    const prevState = state;
    const updates = typeof updater === 'function' ? updater(prevState) : updater;

    // Merge updates with current state
    const newState = { ...prevState, ...updates };

    // Validate new state against schema
    const result = schema.safeParse(newState);
    if (!result.success) {
      throw new Error(
        `[${namespace}] Invalid state update: ${result.error.message}`
      );
    }

    state = result.data;

    // Notify state listeners
    for (const listener of stateListeners) {
      try {
        listener(state, prevState);
      } catch (error) {
        console.error(`[${namespace}] Error in state listener:`, error);
      }
    }

    // Notify key listeners for changed keys
    for (const [key, listeners] of keyListeners) {
      const prevValue = prevState[key];
      const newValue = state[key];

      // Only notify if value actually changed
      if (!Object.is(prevValue, newValue)) {
        for (const listener of listeners) {
          try {
            listener(newValue, prevValue);
          } catch (error) {
            console.error(
              `[${namespace}] Error in key listener for "${String(key)}":`,
              error
            );
          }
        }
      }
    }

    // Notify devtools of state change
    if (devtools) {
      devtools._internal.notifyStateChange(namespace, state, prevState);
    }
  }

  function subscribe(listener: (state: State, prevState: State) => void): () => void {
    checkDestroyed();
    stateListeners.add(listener);

    return () => {
      stateListeners.delete(listener);
    };
  }

  function subscribeKey<K extends keyof State>(
    key: K,
    listener: (value: State[K], prevValue: State[K]) => void
  ): () => void {
    checkDestroyed();

    let listeners = keyListeners.get(key);
    if (!listeners) {
      listeners = new Set();
      keyListeners.set(key, listeners);
    }
    listeners.add(listener as (value: unknown, prevValue: unknown) => void);

    return () => {
      listeners!.delete(listener as (value: unknown, prevValue: unknown) => void);
      if (listeners!.size === 0) {
        keyListeners.delete(key);
      }
    };
  }

  function dispatch<A extends string>(action: A, payload?: unknown): void {
    checkDestroyed();

    // Track action count and notify devtools
    actionCount++;
    if (devtools) {
      devtools._internal.incrementActionCount(namespace);
      devtools._internal.notifyAction(namespace, action, payload);
    }

    const handlers = actionHandlers.get(action);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[${namespace}] Error in action handler for "${action}":`, error);
        }
      }
    }
  }

  function onAction<P = unknown>(
    action: string,
    handler: (payload: P) => void
  ): () => void {
    checkDestroyed();

    let handlers = actionHandlers.get(action);
    if (!handlers) {
      handlers = new Set();
      actionHandlers.set(action, handlers);
    }
    handlers.add(handler as (payload: unknown) => void);

    return () => {
      handlers!.delete(handler as (payload: unknown) => void);
      if (handlers!.size === 0) {
        actionHandlers.delete(action);
      }
    };
  }

  function destroy(): void {
    checkDestroyed();

    isDestroyed = true;
    stateListeners.clear();
    keyListeners.clear();
    actionHandlers.clear();

    // Unregister from devtools
    if (unregisterFromDevtools) {
      unregisterFromDevtools();
      unregisterFromDevtools = null;
    }
  }

  return {
    getState,
    setState,
    subscribe,
    subscribeKey,
    dispatch,
    onAction,
    destroy,
  };
}
