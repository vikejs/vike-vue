<template>
  <component :is="client ? ClientComponent : ServerComponent" />
</template>

<script lang="ts" setup generic="T extends AsyncComponentLoader">
import { h, ref, onMounted, defineComponent, defineAsyncComponent, useSlots, type AsyncComponentLoader } from 'vue';
import type { Component } from "../renderer/types"

type Props = {
  load: T
}

const props = defineProps<Props>()

type Slots = {
  fallback?: () => Component
  error?: () => Component
}

defineSlots<Slots>()
const slots = useSlots()

const ClientComponent = defineAsyncComponent({
  loader: props.load,
  loadingComponent: slots.fallback,
  errorComponent: slots.error ?? (() => h("p", "Error loading component")),
  onError: (e) => {
    console.error("Component loading failed:", e)
    throw e
  },
  suspensible: false,
})

const ServerComponent = defineComponent({
  render: () => slots.fallback?.(),
})

const client = ref(false)
onMounted(() => {
  client.value = true
})
</script>
