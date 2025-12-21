export { useHydrated }

import { ref, onMounted } from 'vue'
import { usePageContext } from './usePageContext.js'

// Adapted from https://github.com/quasarframework/quasar/blob/4ebebf02ab0cc7c049d2697544210115ed89e491/ui/src/composables/use-hydration/use-hydration.js
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
  const pageContext = usePageContext()
  const isHydrated = ref(pageContext.isClientSide && !pageContext.isHydration)

  if (pageContext.isClientSide && !isHydrated.value) {
    onMounted(() => {
      isHydrated.value = true
    })
  }

  return isHydrated
}
