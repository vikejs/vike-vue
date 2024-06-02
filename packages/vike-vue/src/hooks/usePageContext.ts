// Hook `usePageContext()` to make `pageContext` available from any Vue component.
// See
// * https://vike.dev/usePageContext

import { inject } from 'vue'
import type { App } from 'vue'
import type { PageContext } from 'vike/types'

export { usePageContext }
export { setPageContext }

const key = 'vike-vue:usePageContext'

function usePageContext() {
  const pageContext = inject(key)
  return pageContext as PageContext
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
