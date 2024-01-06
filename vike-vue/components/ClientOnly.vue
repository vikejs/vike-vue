<template>
  <component :is="client ? ClientComponent : ServerComponent" />
</template>

<script lang="ts" setup generic="T extends AsyncComponentLoader">
import { h, ref, onMounted, defineComponent, defineAsyncComponent, useSlots, type AsyncComponentLoader } from 'vue';
import type { Component } from "../renderer/types"

type Props = {
  load?: T
}

const props = defineProps<Props>()

type Slots = {
  default?: () => Component
  fallback?: () => Component
  error?: () => Component
}

defineSlots<Slots>()
const slots = useSlots()

if (!slots.default && !props.load) {
  throw new Error("ClientOnly component requires either a default slot or a load prop")
}

if (slots.default && props.load) {
  throw new Error("ClientOnly component requires either a default slot or a load prop, not both")
}

const loader = props.load ?? (() => Promise.resolve(slots.default))

const ClientComponent = defineAsyncComponent({
  loader,
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
