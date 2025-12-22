<template>
  <button type="button" @click="state.count++" :disabled="!hydrated">Counter {{ state.count }}</button>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { useHydrated } from 'vike-vue/useHydrated'

export default {
  setup(props) {
    const state = reactive({ count: 0 })
    const hydrated = useHydrated()
    return {
      state,
      hydrated,
    }
  },
}
</script>
