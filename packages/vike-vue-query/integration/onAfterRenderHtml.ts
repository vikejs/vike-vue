export { onAfterRenderHtml }

import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const onAfterRenderHtml: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
