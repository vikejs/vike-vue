<template>
  <button type="button" @click="state.count++">Counter {{ state.count }}</button>
</template>

<script lang="ts">
import { reactive } from 'vue'
// TODO/ai
// 1. add useHydrated example
// 2. update jsdocs https://github.com/vikejs/vike-vue/blob/68c513d15ff2f57081a7d803e4e861c2edcc818b/packages/vike-vue/src/hooks/useHydrated.ts#L15-L22
export default {
  setup(props) {
    const state = reactive({ count: 0 })
    return {
      state,
    }
  },
}
</script>
