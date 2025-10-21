// https://vike.dev/useData
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App, ShallowRef } from 'vue'
import type { PageContext } from 'vike/types'

const key = 'vike-vue:usePageContext'

/** https://vike.dev/usePageContext */
function usePageContext(): ShallowRef<PageContext> {
  const pageContext = inject<ShallowRef<PageContext>>(key)!
  return pageContext
}

function setPageContext(app: App, pageContext: ShallowRef<PageContext>) {
  app.provide(key, pageContext)
}
