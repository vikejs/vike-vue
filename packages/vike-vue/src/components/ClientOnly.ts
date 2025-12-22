export { ClientOnly }

import { cloneVNode, defineComponent } from 'vue'
import type { SlotsType, VNode } from 'vue'
import { usePageContext } from '../hooks/usePageContext.js'
import { useHydrated } from '../hooks/useHydrated.js'
import { assert } from '../utils/assert.js'

type ClientOnlySlots = SlotsType<{
  default?: () => VNode[]
  fallback: { attrs: Record<string, any> }
}>

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  inheritAttrs: false,
  slots: {} as ClientOnlySlots,
  setup(_, { slots, attrs }) {
    const isHydrated = useHydrated()
    return () => {
      const pageContext = usePageContext()

      // Assert tree-shaking: children should be removed on the server-side
      if (!pageContext.isClientSide) assert(slots.default === undefined)

      // Main
      if (isHydrated.value) {
        const vnodes = slots.default?.()
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0]!, attrs)]
        }
        return vnodes
      }

      // Fallback
      if (slots['fallback']) {
        return slots['fallback']({ attrs })
      }
    }
  },
})
