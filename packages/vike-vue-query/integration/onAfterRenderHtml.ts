export { onAfterRenderHtml }

import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const onAfterRenderHtml: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  deonBeforeRenderClient(pageContext)
}

type PageContext = Parameters<typeof onAfterRenderHtml>[0]
function deonBeforeRenderClient(pageContext: PageContext) {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
