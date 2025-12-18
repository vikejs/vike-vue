export { useHydrated }

import { shallowRef, onMounted } from 'vue'

/**
 * Returns whether the component has been hydrated on the client-side.
 * Always returns `false` on the server-side.
 *
 * https://vike.dev/useHydrated
 */
function useHydrated() {
  const hydrated = shallowRef(false)

  onMounted(() => {
    hydrated.value = true
  })

  return hydrated
}
