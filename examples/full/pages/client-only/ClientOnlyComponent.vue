<template>
  <div>
    <p>Client-side only text.</p>
    <p>Message: {{ msg }}</p>
    <p><Counter /></p>
  </div>
</template>

<style scoped>
p {
  color: blue;
}
</style>

<script setup lang="ts">
const props = defineProps<{ msg: string }>()
import Counter from '../../components/Counter.vue'

const isBrowser = typeof window !== 'undefined'
console.log('Runs only on the client side — isBrowser:', isBrowser)
if (!isBrowser) throw new Error('<ClientOnlyComponent> loaded on the server')
</script>
