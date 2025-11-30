/**
 * Vue composable for subscribing to a specific key in a bridge state.
 */

import { ref, onUnmounted, type Ref } from 'vue';
import type { Bridge } from '@mfe-stack/core';

/**
 * Subscribe to a specific key in the bridge state.
 * Returns a reactive ref that updates when the key changes.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBridgeState } from '@mfe-stack/vue';
 * import { cartBridge } from '@my-platform/shared';
 *
 * const items = useBridgeState(cartBridge, 'items');
 * </script>
 *
 * <template>
 *   <span>Cart ({{ items.length }})</span>
 * </template>
 * ```
 */
export function useBridgeState<T, K extends keyof T>(
  bridge: Bridge<T>,
  key: K
): Ref<T[K]> {
  const state = ref(bridge.getState()[key]) as Ref<T[K]>;

  const unsubscribe = bridge.subscribeKey(key, (value) => {
    state.value = value;
  });

  onUnmounted(unsubscribe);

  return state;
}
