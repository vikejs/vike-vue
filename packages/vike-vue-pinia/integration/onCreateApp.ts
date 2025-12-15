export { onCreateApp }

import type { PageContext } from 'vike/types'
import { createPiniaPlus } from './createPiniaPlus'

async function onCreateApp(pageContext: PageContext) {
  const { app } = pageContext
  if (!app) return

  if (pageContext.isClientSide) {
    const pinia = await createPiniaPlus(pageContext, true)
    /* TODO/ai implement this — the idea is to re-render the component after hydration
    pageContext._piniaInitialStateClient = pinia.state.value
    */
    const { _piniaInitialState } = pageContext
    if (_piniaInitialState) {
      pinia.state.value = {
        ..._piniaInitialState,
        // Preserve client-side persisted state — e.g. `localStorage`
        // https://github.com/vikejs/vike/issues/2881
        // TODO/ai: remove this line (see TODO/ai below)
        ...pinia.state.value,
      }
    }
  }

  app.use(pageContext.globalContext.pinia ?? pageContext.pinia!)
}
