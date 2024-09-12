import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

export { dehydrateVueQuery }

const dehydrateVueQuery: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
