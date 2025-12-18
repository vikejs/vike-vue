<template>
  <h1>My Vike + Vue app</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
    <ClientOnly>
      <template #fallback>
        <li>Loading client-only component...</li>
      </template>
      <ClientOnlyComponent />
      <div>This is a test</div>
    </ClientOnly>
  </ul>
</template>

<script lang="ts">
import Counter from '../../components/Counter.vue'
import { ClientOnly } from 'vike-vue/ClientOnly'
import ClientOnlyComponent from './ClientOnlyComponent.vue'
const components = { Counter, ClientOnly, ClientOnlyComponent }
export default { components }
</script>
