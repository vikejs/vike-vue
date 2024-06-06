<template>
  <button type="button" @click="state.count++">
    <slot name="prefix">Counter </slot>
    <slot :count="state.count">
      {{ state.count }}
    </slot>
    <slot name="suffix" />
    <slot name="fallback" />
  </button>
</template>

<script lang="ts">
import { reactive, watch, type SlotsType } from 'vue'
export default {
  props: {
    start: {
      type: Number,
      default: 0,
    },
  },

  slots: Object as SlotsType<{
    default: { count: number }
    prefix: {}
    suffix: {}
  }>,

  emits: {
    increment(value: number) {
      return true
    },
  },

  setup(props, { emit }) {
    const state = reactive({ count: props.start })

    watch(
      () => state.count,
      (val) => {
        emit('increment', val)
      },
    )

    return {
      state,
    }
  },
}
</script>
