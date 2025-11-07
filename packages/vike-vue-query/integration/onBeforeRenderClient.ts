export { onBeforeRenderClient }

import { hydrate } from '@tanstack/vue-query'
import type { PageContextClient } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContextClient) {
  hydrateVueQuery(pageContext)
}

type PageContext = Parameters<typeof onBeforeRenderClient>[0]
function hydrateVueQuery(pageContext: PageContext) {
  if (!pageContext.isHydration) {
    return
  }
  const vueQueryInitialState = pageContext._vueQueryInitialState
  const queryClient = 'queryClient' in pageContext ? pageContext.queryClient : null
  if (!queryClient || !vueQueryInitialState) {
    // happens if SSR is off
    return
  }
  hydrate(queryClient, vueQueryInitialState)
}
