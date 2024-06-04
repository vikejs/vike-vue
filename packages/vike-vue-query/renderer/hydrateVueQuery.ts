import { hydrate } from '@tanstack/vue-query'
import type { OnBeforeRenderClientSync } from 'vike-vue/types'

export { hydrateVueQuery }

const hydrateVueQuery: OnBeforeRenderClientSync = ({
  queryClient,
  fromHtmlRenderer,
  isHydration,
}): ReturnType<OnBeforeRenderClientSync> => {
  if (!isHydration) {
    return
  }
  const { vueQueryInitialState } = fromHtmlRenderer

  if (!queryClient || !vueQueryInitialState) {
    // happens if SSR is off
    return
  }

  hydrate(queryClient, vueQueryInitialState)
}
