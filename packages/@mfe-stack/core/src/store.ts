/**
 * Global store that persists across MFE lifecycles.
 */

export interface StoreConfig {
  /**
   * Whether to persist the store to localStorage.
   */
  persist?: boolean;

  /**
   * Storage key for persistence. Defaults to '@mfe-stack/store'.
   */
  key?: string;
}

export interface Store<T extends Record<string, unknown>> {
  /**
   * Get a value from the store.
   */
  get<K extends keyof T>(key: K): T[K] | undefined;

  /**
   * Set a value in the store.
   */
  set<K extends keyof T>(key: K, value: T[K]): void;

  /**
   * Delete a value from the store.
   */
  delete<K extends keyof T>(key: K): void;

  /**
   * Clear all values from the store.
   */
  clear(): void;

  /**
   * Subscribe to changes for a specific key. Returns an unsubscribe function.
   */
  subscribe<K extends keyof T>(
    key: K,
    listener: (value: T[K] | undefined) => void
  ): () => void;
}

const DEFAULT_STORAGE_KEY = '@mfe-stack/store';

/**
 * Create a global store for cross-MFE state sharing.
 *
 * @example
 * ```typescript
 * interface AppStore {
 *   user: { id: string; name: string } | null;
 *   theme: 'light' | 'dark';
 * }
 *
 * const store = createStore<AppStore>({ persist: true });
 *
 * // Set values
 * store.set('user', { id: '123', name: 'John' });
 * store.set('theme', 'dark');
 *
 * // Get values
 * const user = store.get('user');
 *
 * // Subscribe to changes
 * const unsubscribe = store.subscribe('theme', (theme) => {
 *   console.log('Theme changed:', theme);
 * });
 * ```
 */
export function createStore<T extends Record<string, unknown>>(
  config?: StoreConfig
): Store<T> {
  const { persist = false, key = DEFAULT_STORAGE_KEY } = config ?? {};

  // Initialize data from storage if persistence is enabled
  let data: Map<keyof T, T[keyof T]> = new Map();
  const listeners = new Map<keyof T, Set<(value: unknown) => void>>();

  // Load persisted data
  if (persist && typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          for (const [k, v] of Object.entries(parsed)) {
            data.set(k as keyof T, v as T[keyof T]);
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  function persistData(): void {
    if (persist && typeof window !== 'undefined' && window.localStorage) {
      try {
        const obj: Record<string, unknown> = {};
        for (const [k, v] of data.entries()) {
          obj[k as string] = v;
        }
        window.localStorage.setItem(key, JSON.stringify(obj));
      } catch {
        // Ignore storage errors
      }
    }
  }

  function notifyListeners<K extends keyof T>(storeKey: K, value: T[K] | undefined): void {
    const keyListeners = listeners.get(storeKey);
    if (keyListeners) {
      for (const listener of keyListeners) {
        try {
          listener(value);
        } catch (error) {
          console.error(`Error in store listener for "${String(storeKey)}":`, error);
        }
      }
    }
  }

  function get<K extends keyof T>(storeKey: K): T[K] | undefined {
    return data.get(storeKey) as T[K] | undefined;
  }

  function set<K extends keyof T>(storeKey: K, value: T[K]): void {
    data.set(storeKey, value);
    persistData();
    notifyListeners(storeKey, value);
  }

  function deleteKey<K extends keyof T>(storeKey: K): void {
    data.delete(storeKey);
    persistData();
    notifyListeners(storeKey, undefined);
  }

  function clear(): void {
    const keys = Array.from(data.keys());
    data.clear();
    persistData();

    for (const storeKey of keys) {
      notifyListeners(storeKey, undefined);
    }
  }

  function subscribe<K extends keyof T>(
    storeKey: K,
    listener: (value: T[K] | undefined) => void
  ): () => void {
    let keyListeners = listeners.get(storeKey);
    if (!keyListeners) {
      keyListeners = new Set();
      listeners.set(storeKey, keyListeners);
    }
    keyListeners.add(listener as (value: unknown) => void);

    return () => {
      keyListeners!.delete(listener as (value: unknown) => void);
      if (keyListeners!.size === 0) {
        listeners.delete(storeKey);
      }
    };
  }

  return {
    get,
    set,
    delete: deleteKey,
    clear,
    subscribe,
  };
}
