// https://vike.dev/useData
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App, ShallowReactive } from 'vue'
import type { PageContext } from 'vike/types'

const key = 'vike-vue:usePageContext'

/** https://vike.dev/usePageContext */
function usePageContext(): ShallowReactive<PageContext> {
  const pageContext = inject<ShallowReactive<PageContext>>(key)
  if (!pageContext) throw new Error('setPageContext() not called')
  return pageContext
}

function setPageContext(app: App, pageContext: ShallowReactive<PageContext>) {
  app.provide(key, pageContext)
}
