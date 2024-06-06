<template>
  <button type="button" @click="state.status = state.status !== true">
    <slot name="prefix">
      State is
    </slot>
    <slot :status="state.status">
      {{ state.status ? 'On' : 'Off' }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: boolean
  }>(),
  {
    status: false,
  },
)

const emit = defineEmits<{
  toggle: [value: boolean]
}>()

defineSlots<{
  default: { status: boolean }
  prefix: {}
}>()

const state = reactive({ status: false })

watch(
  () => props.status,
  (val) => {
    state.status = val
  },
  { immediate: true },
)

watch(
  () => state.status,
  (val) => {
    emit('toggle', val)
  },
)
</script>
