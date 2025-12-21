export { useHydrated }

import { ref, onMounted } from 'vue'
import { usePageContext } from './usePageContext.js'

/**
 * Returns whether the component has been hydrated on the client-side.
 * Always returns `false` on the server-side.
 *
 * https://vike.dev/useHydrated
 */
function useHydrated() {
  const pageContext = usePageContext()
  const isHydrated = ref(pageContext.isClientSide && !pageContext.isHydration)

  if (!isHydrated.value && pageContext.isClientSide) {
    onMounted(() => {
      isHydrated.value = true
    })
  }

  return isHydrated
}
