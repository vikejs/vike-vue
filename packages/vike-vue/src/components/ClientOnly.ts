export { ClientOnly }

import { cloneVNode, defineComponent, onMounted, shallowRef } from 'vue'
import type { InjectionKey, SlotsType, VNode } from 'vue'
import { usePageContext } from '../hooks/usePageContext.js'
import { assert } from '../utils/assert.js'

export const clientOnlySymbol: InjectionKey<boolean> = Symbol.for('nuxt:client-only')

type ClientOnlySlots = SlotsType<{
  default?: () => VNode[]
  fallback: { attrs: Record<string, any> }
  'client-only-fallback': { attrs: Record<string, any> }
}>

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  inheritAttrs: false,
  slots: {} as ClientOnlySlots,
  setup(_, { slots, attrs }) {
    // TODO: useHydrated instead
    const mounted = shallowRef(false)
    onMounted(() => {
      mounted.value = true
    })
    return () => {
      const pageContext = usePageContext()

      // Assert tree-shaking: children should be removed on the server-side
      if (!pageContext.isClientSide) assert(slots.default === undefined)

      // Main
      if (mounted.value) {
        const vnodes = slots.default?.()
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0]!, attrs)]
        }
        return vnodes
      }

      // Fallback
      if (slots['client-only-fallback']) {
        return slots['client-only-fallback']({ attrs })
      }
      if (slots['fallback']) {
        return slots['fallback']({ attrs })
      }
    }
  },
})

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * let hydrated = useHydrated();
 * return (
 *   <button type="button" disabled={!hydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
function useHydrated() {
  // TODO/ai implement using pageContext.isClientSide and pageContext.isHydration
}
