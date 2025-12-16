<template>
  <h1>About</h1>
  <p>Example of using Pinia.</p>
  <Counter id="counter-3" />
  <p>Example of using Pinia with state persistence.</p>
  <p><strong>This counter persists across page reloads (stored in localStorage)</strong></p>
  <ClientOnlyPersistedCounter id="counter-4">
    <template #fallback>
      <div>Loading...</div>
    </template>
  </ClientOnlyPersistedCounter>
</template>

<script lang="ts" setup>
import Counter from '../../components/Counter.vue'
import { clientOnly } from 'vike-vue/clientOnly'

const ClientOnlyPersistedCounter = clientOnly(() => import('../../components/PersistedCounter.vue'))
</script>
