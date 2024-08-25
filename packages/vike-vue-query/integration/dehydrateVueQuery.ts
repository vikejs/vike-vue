import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

export { dehydrateVueQuery }

const dehydrateVueQuery: OnAfterRenderHtmlSync = ({ queryClient }): ReturnType<OnAfterRenderHtmlSync> => {
  return { vueQueryInitialState: dehydrate(queryClient!) }
}
