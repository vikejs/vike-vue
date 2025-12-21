export { useHydrated }

import { usePageContext } from './usePageContext.js'

/**
 * Returns whether the component has been hydrated on the client-side.
 * Always returns `false` on the server-side.
 *
 * https://vike.dev/useHydrated
 */
function useHydrated() {
  const pageContext = usePageContext()
  return pageContext.isClientSide && !pageContext.isHydration
}
