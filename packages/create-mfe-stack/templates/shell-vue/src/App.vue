<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

// Dynamic import of remote component
const RemoteApp = defineAsyncComponent(() => import('remote1/App'))
</script>

<template>
  <div class="app">
    <Header />
    <main class="main">
      <section class="local-content">
        <h2>Local Shell Content</h2>
        <p>This content is rendered by the shell application.</p>
      </section>

      <section class="remote-content">
        <h2>Remote Micro-Frontend</h2>
        <Suspense>
          <template #default>
            <RemoteApp />
          </template>
          <template #fallback>
            <div class="loading">Loading remote...</div>
          </template>
        </Suspense>
      </section>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.local-content,
.remote-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.local-content h2,
.remote-content h2 {
  margin-bottom: 1rem;
  color: #333;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>
