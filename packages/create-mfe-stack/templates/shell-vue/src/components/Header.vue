<script setup lang="ts">
</script>

<template>
  <header class="header">
    <h1>🏠 Shell Application</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
}

.header nav {
  display: flex;
  gap: 1rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.header nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
