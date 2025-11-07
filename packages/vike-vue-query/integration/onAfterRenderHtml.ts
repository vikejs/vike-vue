export { onAfterRenderHtml }

import { dehydrate } from '@tanstack/vue-query'
import type { PageContextServer } from 'vike/types'

const onAfterRenderHtml = (pageContext: PageContextServer) => {
  dehydrateVueQuery(pageContext)
}

function dehydrateVueQuery(pageContext: PageContextServer) {
  pageContext._vueQueryInitialState = dehydrate(pageContext.queryClient!)
}
