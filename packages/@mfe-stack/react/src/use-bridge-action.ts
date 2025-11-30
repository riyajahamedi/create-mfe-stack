/**
 * React hook for dispatching bridge actions.
 */

import { useCallback } from 'react';
import type { Bridge } from '@mfe-stack/core';

/**
 * Get a memoized action dispatcher for a bridge.
 *
 * @example
 * ```tsx
 * import { useBridgeAction } from '@mfe-stack/react';
 * import { cartBridge } from '@my-platform/shared';
 *
 * function AddToCartButton({ product }) {
 *   const dispatch = useBridgeAction(cartBridge);
 *
 *   const handleClick = () => {
 *     dispatch('ADD_ITEM', {
 *       id: product.id,
 *       name: product.name,
 *       quantity: 1,
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Add to Cart</button>;
 * }
 * ```
 */
export function useBridgeAction<T>(
  bridge: Bridge<T>
): <A extends string>(action: A, payload?: unknown) => void {
  return useCallback(
    (action: string, payload?: unknown) => {
      bridge.dispatch(action, payload);
    },
    [bridge]
  );
}
