<template>
  <ClientComponent v-if="client" />
</template>

<script lang="ts" setup generic="T extends AsyncComponentLoader">
import { h, ref, onMounted, defineAsyncComponent, useSlots, type AsyncComponentLoader } from 'vue';
import type { Component } from "../renderer/types"

type Props = {
  load: T
}

const props = defineProps<Props>()

type Slots = {
  fallback?: () => Component
}

defineSlots<Slots>()
const slots = useSlots()

const ClientComponent = defineAsyncComponent({
  loader: props.load,
  loadingComponent: slots.fallback,
  onError: (e) => {
    console.error("Component loading failed:", e)
    throw e
  },
  suspensible: false,
})

const client = ref(false)
onMounted(() => {
  client.value = true
})
</script>
