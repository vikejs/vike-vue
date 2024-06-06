export { clientOnly }

import { h, nextTick, shallowRef, defineComponent, onBeforeMount } from 'vue'
import type { Component, SlotsType, ExtractPropTypes } from 'vue'

function clientOnly<T extends Component>(loader: () => Promise<T | { default: T }>) {
  const clientOnlyComponent = defineComponent({
    inheritAttrs: false,

    setup(_, { attrs, slots }) {
      const resolvedComp = shallowRef<T | null>(null)
      const error = shallowRef<unknown>(null)

      onBeforeMount(async () => {
        try {
          const component = await loader()
          resolvedComp.value = 'default' in component ? component.default : component
        } catch (e) {
          console.error('Failed loading component:', e)
          // wait for nextTick to avoid hydration errors
          nextTick(() => {
            error.value = e
          })
        }
      })

      return () =>
        resolvedComp.value !== null
          ? h(resolvedComp.value, attrs, slots)
          : slots['client-only-fallback']
            ? slots['client-only-fallback']({ error: error.value, attrs })
            : // If the user doesn't want clientOnly() to use <template #fallback> then he should define a (empty) <template #client-only-fallback>
              slots['fallback']?.({ error: error.value, attrs })
    },

    slots: {} as SlotsType<{
      fallback: { error: unknown; attrs: Record<string, any> }
      'client-only-fallback': { error: unknown; attrs: Record<string, any> }
    }>,
  })

  return clientOnlyComponent as typeof clientOnlyComponent & T
}
