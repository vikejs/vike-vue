export { ClientOnly }

import { cloneVNode, defineComponent, onMounted, shallowRef } from 'vue'
import type { InjectionKey, SlotsType, VNode } from 'vue'
import {usePageContext} from '../hooks/usePageContext.js'
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
