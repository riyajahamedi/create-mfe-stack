/**
 * Vue composable for subscribing to the entire bridge state.
 */

import { ref, onUnmounted, type Ref } from 'vue';
import type { Bridge } from '@mfe-stack/core';

/**
 * Subscribe to the entire bridge state.
 * Returns a reactive ref that updates when any part of the state changes.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBridge } from '@mfe-stack/vue';
 * import { cartBridge } from '@my-platform/shared';
 *
 * const state = useBridge(cartBridge);
 * </script>
 *
 * <template>
 *   <div>
 *     <h2>Cart ({{ state.items.length }} items)</h2>
 *     <p>Total: ${{ state.total }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useBridge<T>(bridge: Bridge<T>): Ref<T> {
  const state = ref(bridge.getState()) as Ref<T>;

  const unsubscribe = bridge.subscribe((newState) => {
    state.value = newState;
  });

  onUnmounted(unsubscribe);

  return state;
}
