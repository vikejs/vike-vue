export { onCreateApp }

import { createPinia } from 'pinia'
import { PageContext } from 'vike/types'

const onCreateApp = (pageContext: PageContext) => {
  const { app, globalContext, _piniaInitialState, isClientSide } = pageContext

  if (!app) return

  if (isClientSide) {
    const pinia = createPinia()
    if (_piniaInitialState) pinia.state.value = _piniaInitialState
    Object.assign(globalContext, { pinia })
  }

  app.use(pageContext.globalContext?.pinia ?? pageContext.pinia!)
}
