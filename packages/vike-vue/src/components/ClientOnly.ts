export { ClientOnly }

import { defineComponent } from 'vue'
import { usePageContext } from '../hooks/usePageContext.js'
import { useHydrated } from '../hooks/useHydrated.js'
import { assert } from '../utils/assert.js'

/**
 * Render children only on the client-side.
 *
 * Strips the children slot on server-side to remove
 * the component from the server bundle.
 *
 * https://vike.dev/ClientOnly
 */
const ClientOnly = defineComponent({
  name: 'ClientOnly',

  setup(_, { slots }) {
    const pageContext = usePageContext()
    if (!pageContext.isClientSide) {
      // TODO/ai I think this is wrong? Shouldn't the transform always be applied — also in dev?
      // In dev mode without transformation, slots.default might still exist
      // but we assert it should be undefined in production after babel transformation
      if (slots.default !== undefined && import.meta.env.PROD) {
        assert(false)
      }
    }

    const hydrated = useHydrated()

    return () => {
      if (hydrated.value) {
        return slots.default?.()
      } else if (slots.fallback) {
        return slots.fallback()
      }
      return null
    }
  },
})
