export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'
import { createPinia } from 'pinia'

function onCreatePageContext(pageContext: PageContextServer) {
  if (pageContext.isClientSideNavigation || !pageContext.Page) return // only SSR
  pageContext.pinia = createPinia()
}
