import { hydrate } from '@tanstack/vue-query'
import type { OnBeforeMountAppSync } from 'vike-vue/types'

export { hydrateVueQuery }

const hydrateVueQuery: OnBeforeMountAppSync = ({ queryClient, fromHtmlRenderer }): ReturnType<OnBeforeMountAppSync> => {
  const { vueQueryInitialState } = fromHtmlRenderer

  if (!queryClient || !vueQueryInitialState) {
    // happens if SSR is off
    return
  }

  hydrate(queryClient, vueQueryInitialState)
}
