// https://vike.dev/useData
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App } from 'vue'
import type { PageContext } from 'vike/types'

const key = 'vike-vue:usePageContext'

function usePageContext() {
  const pageContext = inject(key)
  return pageContext as PageContext
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
