export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'
import { createPinia } from 'pinia'

function onCreatePageContext(pageContext: PageContextServer) {
  if (pageContext.isClientSideNavigation) return // only SSR
  pageContext.pinia = createPinia()
}
