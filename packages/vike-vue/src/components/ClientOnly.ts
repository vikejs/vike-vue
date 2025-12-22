export { ClientOnly }

import { cloneVNode, defineComponent } from 'vue'
import type { SlotsType, VNode } from 'vue'
import { usePageContext } from '../hooks/usePageContext.js'
import { useHydrated } from '../hooks/useHydrated.js'
import { assert } from '../utils/assert.js'

// Nuxt implementation: https://github.com/nuxt/nuxt/blob/1363c12dac07e7a926db66082e1b6b46f8fb2b32/packages/nuxt/src/app/components/client-only.ts

type Slots = SlotsType<{
  default?: () => VNode[]
  fallback?: { attrs: Record<string, any> }
}>

/**
 * Render children only on the client-side.
 *
 * Children (default slot) are completely removed and never loaded on the server.
 *
 * https://vike.dev/ClientOnly
 */
const ClientOnly = defineComponent({
  name: 'ClientOnly',
  inheritAttrs: false,
  slots: {} as Slots,
  setup(_, { slots, attrs }) {
    const hydrated = useHydrated()
    return () => {
      const pageContext = usePageContext()

      // Assert tree-shaking: children should be statically removed on the server-side
      if (!pageContext.isClientSide) assert(slots.default === undefined)

      // Default slot
      if (hydrated.value) {
        const vnodes = slots.default?.()
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0]!, attrs)]
        }
        return vnodes
      }

      // Fallback slot
      if (slots['fallback']) {
        return slots['fallback']({ attrs })
      }
    }
  },
})
