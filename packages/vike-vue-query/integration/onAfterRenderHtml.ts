export { onAfterRenderHtml }

import { dehydrate } from '@tanstack/vue-query'
import type { PageContextServer } from 'vike/types'

const onAfterRenderHtml = (pageContext: PageContextServer) => {
  dehydrateVueQuery(pageContext)
}

type PageContext = Parameters<typeof onAfterRenderHtml>[0]
function dehydrateVueQuery(pageContext: PageContext) {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
