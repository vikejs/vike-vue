export { useHydrated }

import { ref, onMounted } from 'vue'
import { usePageContext } from './usePageContext.js'

// Adapted from https://github.com/quasarframework/quasar/blob/4ebebf02ab0cc7c049d2697544210115ed89e491/ui/src/composables/use-hydration/use-hydration.js
/**
 * Whether the page has already been hydrated.
 *
 * On the server, it always returns `false`. On the client, it returns `false` on first render and `true` after hydration completes.
 *
 * https://vike.dev/useHydrated
 *
 * Example: Disable a button that needs JavaScript to work.
 * ```vue
 * <template>
 *   <button type="button" :disabled="!hydrated" @click="doSomething">
 *     Click me
 *   </button>
 * </template>
 *
 * <script setup>
 * import { useHydrated } from 'vike-vue/useHydrated'
 * const hydrated = useHydrated()
 * </script>
 * ```
 */
function useHydrated() {
  const pageContext = usePageContext()

  const hydrated = ref(pageContext.isClientSide && !pageContext.isHydration)

  if (pageContext.isClientSide && pageContext.isHydration) {
    onMounted(() => {
      hydrated.value = true
    })
  }

  return hydrated
}
