export { onCreateApp }

import type { PageContext } from 'vike/types'
import { createPiniaPlus } from './createPiniaPlus.js'

async function onCreateApp(pageContext: PageContext) {
  const { app } = pageContext
  if (!app) return

  if (pageContext.isClientSide) {
    const pinia = await createPiniaPlus(pageContext, true)
    const { _piniaInitialState } = pageContext
    if (_piniaInitialState) pinia.state.value = _piniaInitialState
  }

  app.use(pageContext.globalContext.pinia ?? pageContext.pinia!)
}
