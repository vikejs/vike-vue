<template>
  <button type="button" @click="counterStore.increment">Persisted Counter {{ counterStore.count }}</button>
</template>

<script lang="ts" setup>
import { usePersistedCounterStore } from '../stores/usePersistedCounterStore'

const counterStore = usePersistedCounterStore()
</script>
