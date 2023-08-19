// Hook `usePageContext()` to make `pageContext` available from any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { inject } from 'vue'
import type { App } from 'vue'
import { PageContext } from '../renderer/types'

export { usePageContext }
export { setPageContext }

const key = '__vike-vue__bcc79e46-5797-40d8-9cec-e9daf9c62ce8'

function usePageContext() {
  const pageContext = inject(key)
  return pageContext
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
