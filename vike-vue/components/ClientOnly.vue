<template>
  <Suspense>
    <component :is="comp" v-bind="$attrs" />
    <template #fallback>
      <slot name="fallback" />
    </template>
  </Suspense>
</template>

<script lang="ts" setup generic="T extends AsyncComponentLoader">
import { h, onMounted, defineComponent, defineAsyncComponent, shallowRef, type AsyncComponentLoader } from 'vue';

defineOptions({ inheritAttrs: false })

type Props = {
  load: T
}

const props = defineProps<Props>()

const ClientOnlyError = defineComponent({
  setup: () => h("p", "Error loading component"),
})

const AsyncComponent = defineAsyncComponent({
  loader: props.load,
  errorComponent: ClientOnlyError,
  onError: (e) => {
    console.error("Component loading failed:", e)
  },
})

const EmptyComponent = defineComponent({
  render: () => null,
})

const comp = shallowRef<any>(EmptyComponent)
onMounted(() => {
  comp.value = AsyncComponent
})
</script>
