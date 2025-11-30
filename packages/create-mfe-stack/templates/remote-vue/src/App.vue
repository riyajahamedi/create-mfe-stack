<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="remote-app">
    <div class="remote-badge">Remote MFE</div>
    <h3>👋 Hello from Vue Remote!</h3>
    <p>This component is loaded from a separate micro-frontend.</p>

    <div class="counter">
      <p>Count: {{ count }}</p>
      <button @click="count++">Increment</button>
      <button @click="count = 0">Reset</button>
    </div>

    <div class="info">
      <p>✨ This remote exposes its App component via Module Federation</p>
    </div>
  </div>
</template>

<style scoped>
.remote-app {
  padding: 1.5rem;
  border: 2px dashed #42b883;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  position: relative;
}

.remote-badge {
  position: absolute;
  top: -12px;
  right: 16px;
  background: #42b883;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.remote-app h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.remote-app p {
  color: #666;
  margin-bottom: 1rem;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.counter p {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  min-width: 100px;
}

.counter button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.counter button:hover {
  background: #3aa876;
}

.counter button:last-child {
  background: #e74c3c;
}

.counter button:last-child:hover {
  background: #c0392b;
}

.info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 4px;
}

.info p {
  margin: 0;
  font-size: 0.875rem;
  color: #42b883;
}
</style>
