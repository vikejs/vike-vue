<template>
  <h1>ClientOnly</h1>
  <h2>Basic Usage</h2>
  <pre><code>{{ `<ClientOnly :load="() => import('../../components/Counter.vue')">
  <template #fallback>
    <p>Loading...</p>
  </template>
</ClientOnly>
` }}</code></pre>
  <p>Time until load: {{ timeLeft / 1000 }}s</p>
  <h2>ClientOnly that succeeds</h2>
  <ClientOnly :load="load">
    <template #fallback>
      <p>Loading...</p>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import ClientOnly from '../../../../vike-vue/components/ClientOnly.vue'

const delay = 3000;

const timeLeft = ref(delay);

const interval = setInterval(() => {
  timeLeft.value -= 100;
}, 100)

watchEffect(() => {
  if (timeLeft.value <= 0) {
    clearInterval(interval)
  }
})

const load = () => new Promise((resolve) => setTimeout(async () => {
  const Counter = await import('../../components/Counter.vue')
  resolve(Counter)
}, delay))
</script>

<style scoped>
pre {
  background-color: #eee;
  padding: 1rem;
}
</style>
