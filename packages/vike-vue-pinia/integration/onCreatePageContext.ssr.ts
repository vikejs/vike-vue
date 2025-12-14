export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'
import { createPinia } from 'pinia'

function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.pinia = createPinia()
}
