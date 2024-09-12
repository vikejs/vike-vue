<template>
  <h1>My Vike + Vue app</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive.</li>
  </ul>
  <h2>Counters synced via shared store</h2>
  <Counter id="counter-1" />
  <hr />
  <Counter id="counter-2"/>
</template>

<script lang="ts" setup>
import { onServerPrefetch } from 'vue'
import Counter from '../../components/Counter.vue'
import { useCounterStore } from '../../stores/useCounterStore'

const { increment } = useCounterStore()
onServerPrefetch(() => {
  // Show that hydration works - the counter should start at 1
  increment()
})
</script>
