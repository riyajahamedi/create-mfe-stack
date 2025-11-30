/**
 * React hook for subscribing to the entire bridge state.
 */

import { useSyncExternalStore, useCallback } from 'react';
import type { Bridge } from '@mfe-stack/core';

/**
 * Subscribe to the entire bridge state.
 * Uses React's useSyncExternalStore for optimal performance and concurrent mode compatibility.
 *
 * @example
 * ```tsx
 * import { useBridge } from '@mfe-stack/react';
 * import { cartBridge } from '@my-platform/shared';
 *
 * function Cart() {
 *   const state = useBridge(cartBridge);
 *   return (
 *     <div>
 *       <h2>Cart ({state.items.length} items)</h2>
 *       <p>Total: ${state.total}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBridge<T>(bridge: Bridge<T>): T {
  const subscribe = useCallback(
    (callback: () => void) => {
      return bridge.subscribe(callback);
    },
    [bridge]
  );

  const getSnapshot = useCallback(() => {
    return bridge.getState();
  }, [bridge]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
