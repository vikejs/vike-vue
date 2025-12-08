<template>
  <h1>About</h1>
  <p>Example of using Pinia with state persistence.</p>
  <p><strong>This counter persists across page reloads (stored in localStorage)</strong></p>
  <PersistedCounter id="counter-3" />
</template>

<script lang="ts" setup>
import PersistedCounter from '../../components/PersistedCounter.vue'
</script>
