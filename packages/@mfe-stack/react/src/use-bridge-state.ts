/**
 * React hook for subscribing to a specific key in a bridge state.
 */

import { useSyncExternalStore, useCallback } from 'react';
import type { Bridge } from '@mfe-stack/core';

/**
 * Subscribe to a specific key in the bridge state.
 * Uses React's useSyncExternalStore for optimal performance and concurrent mode compatibility.
 *
 * @example
 * ```tsx
 * import { useBridgeState } from '@mfe-stack/react';
 * import { cartBridge } from '@my-platform/shared';
 *
 * function CartIcon() {
 *   const items = useBridgeState(cartBridge, 'items');
 *   return <span>Cart ({items.length})</span>;
 * }
 * ```
 */
export function useBridgeState<T, K extends keyof T>(
  bridge: Bridge<T>,
  key: K
): T[K] {
  const subscribe = useCallback(
    (callback: () => void) => {
      return bridge.subscribeKey(key, callback);
    },
    [bridge, key]
  );

  const getSnapshot = useCallback(() => {
    return bridge.getState()[key];
  }, [bridge, key]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
