<template>
  <Suspense>
    <component :is="shown ? AsyncComponent : EmptyComponent" v-bind="$attrs" />
    <template v-if="!shown" #fallback>
      <slot name="fallback" />
    </template>
  </Suspense>
</template>

<script lang="ts" setup generic="T extends AsyncComponentLoader">
import { h, ref, onMounted, defineComponent, defineAsyncComponent, useSlots, type AsyncComponentLoader } from 'vue';
import type { Component } from '../renderer/types';

defineOptions({ inheritAttrs: false })

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

const ClientOnlyError = defineComponent({
  setup: () => h("p", "Error loading component"),
})

const AsyncComponent = defineAsyncComponent({
  loader: props.load,
  loadingComponent: slots.fallback,
  errorComponent: slots.error ?? ClientOnlyError,
  onError: (e) => {
    console.error("Component loading failed:", e)
  },
  suspensible: false,
})

const EmptyComponent = defineComponent({
  render: () => null,
})

const shown = ref(false)
onMounted(() => {
  shown.value = true
})
</script>
