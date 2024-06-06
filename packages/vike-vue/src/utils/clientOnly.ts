export { clientOnly }

import { h, shallowRef, defineComponent, onBeforeMount } from 'vue'
import type { Component, SlotsType } from 'vue'

type ClientOnlySlots = {
  fallback?: {}
  'client-only-fallback'?: {}
}

function clientOnly<T extends Component>(loader: () => Promise<T | { default: T }>) {
  const clientOnlyComponent = defineComponent({
    inheritAttrs: false,

    setup(_, { attrs, slots }) {
      const resolvedComp = shallowRef<T | null>(null)

      onBeforeMount(() => {
        Promise.resolve(loader())
          .then((component) => {
            resolvedComp.value = 'default' in component ? component.default : component
          })
          .catch((e) => {
            console.error('Failed loading component:', e)
            throw e
          })
      })

      return () =>
        resolvedComp.value !== null
          ? h(resolvedComp.value, attrs, slots)
          : slots['client-only-fallback']
            ? slots['client-only-fallback']()
            : // If the user doesn't want clientOnly() to use <template #fallback> then he should define a (empty) <template #client-only-fallback>
              slots['fallback']?.()
    },

    slots: Object as SlotsType<ClientOnlySlots>,
  })

  return clientOnlyComponent as typeof clientOnlyComponent & T
}
