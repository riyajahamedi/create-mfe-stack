<script setup lang="ts">
import { computed } from 'vue';
import { useBridgeState } from '@mfe-stack/vue';
import { cartBridge, updateQuantity, removeItem } from '@multi-framework/shared';

const items = useBridgeState(cartBridge, 'cart');
const theme = useBridgeState(cartBridge, 'theme');

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
</script>

<template>
  <div class="card">
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <div>
        <h3 style="margin: 0;">Vue Cart</h3>
        <p style="margin: 0; color: #94a3b8;">Live shared state from Vue</p>
      </div>
      <span class="badge">Theme: {{ theme }}</span>
    </header>

    <section v-if="items.length === 0" class="empty">
      Cart is empty. Add items from the React products remote.
    </section>

    <section v-else>
      <div v-for="item in items" :key="item.id" class="item-row">
        <div>
          <div style="font-weight: 700;">{{ item.name }}</div>
          <div style="color: #94a3b8;">${{ item.price.toFixed(2) }}</div>
        </div>

        <div class="actions">
          <button @click="updateQuantity(item.id, -1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="updateQuantity(item.id, 1)">+</button>
        </div>

        <div class="actions">
          <button @click="removeItem(item.id)" style="background: #f43f5e; color: #fff;">Remove</button>
        </div>
      </div>
      <div class="total">Total: ${{ total.toFixed(2) }}</div>
    </section>
  </div>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 700;
}
</style>
