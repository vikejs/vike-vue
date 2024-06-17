export { clientOnly }

import { h, nextTick, shallowRef, defineComponent, onBeforeMount } from 'vue'
import type { Component, SlotsType } from 'vue'

/**
 * Load and render a component only on the client-side.
 *
 * https://vike.dev/ClientOnly
 */
function clientOnly<ComponentLoaded extends Component>(
  load: () => Promise<ComponentLoaded | { default: ComponentLoaded }>,
) {
  const componentWrapper = defineComponent({
    inheritAttrs: false,

    setup(_, { attrs, slots }) {
      const componentLoaded = shallowRef<ComponentLoaded | null>(null)
      const error = shallowRef<unknown>(null)

      onBeforeMount(async () => {
        try {
          const ret = await load()
          componentLoaded.value = 'default' in ret ? ret.default : ret
        } catch (e) {
          console.error('Error while loading clientOnly() component:', e)
          // wait for nextTick to avoid hydration errors
          nextTick(() => {
            error.value = e
          })
        }
      })

      return () => {
        if (componentLoaded.value !== null) {
          return h(componentLoaded.value, attrs, slots)
        }
        if (slots['client-only-fallback']) {
          return slots['client-only-fallback']({ error: error.value, attrs })
        }
        // if the user doesn't want clientOnly() to use <template #fallback> then he should define a (empty) <template #client-only-fallback>
        if (slots['fallback']) {
          return slots['fallback']({ error: error.value, attrs })
        }
      }
    },

    slots: {} as SlotsType<{
      fallback: { error: unknown; attrs: Record<string, any> }
      'client-only-fallback': { error: unknown; attrs: Record<string, any> }
    }>,
  })
  return componentWrapper as typeof componentWrapper & ComponentLoaded
}
