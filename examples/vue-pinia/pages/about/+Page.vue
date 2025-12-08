<template>
  <h1>About</h1>
  <p>Example of using Pinia with state persistence.</p>
  <p><strong>This counter persists across page reloads (stored in localStorage)</strong></p>
  <PersistedCounter v-if="mounted" id="counter-3" />
  <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import PersistedCounter from '../../components/PersistedCounter.vue'

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>
