export { onCreateApp }

import type { PageContext } from 'vike/types'
import { createPinia } from 'pinia'

function onCreateApp(pageContext: PageContext) {
  const { app } = pageContext
  if (!app) return

  if (pageContext.isClientSide) {
    const pinia = createPinia()
    const { _piniaInitialState } = pageContext
    if (_piniaInitialState) {
      pinia.state.value = {
        ..._piniaInitialState,
        // Preserve client-side persisted state — e.g. `localStorage`
        // https://github.com/vikejs/vike/issues/2881
        ...pinia.state.value,
      }
    }
    pageContext.globalContext.pinia = pinia
  }

  app.use(pageContext.globalContext.pinia ?? pageContext.pinia!)
}
