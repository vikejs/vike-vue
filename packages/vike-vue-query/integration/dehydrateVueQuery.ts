export { dehydrateVueQuery }

import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const dehydrateVueQuery: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
