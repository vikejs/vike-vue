export { onCreateApp }

import type { PageContext } from 'vike/types'
import { createPiniaPlus } from './createPiniaPlus'

async function onCreateApp(pageContext: PageContext) {
  const { app } = pageContext
  if (!app) return

  if (pageContext.isClientSide) {
    const pinia = await createPiniaPlus(pageContext, true)
    console.log('pinia.state.value', pinia.state.value)
    console.log('pinia.state.value.persistedCounter', pinia.state.value.persistedCounter)
    pageContext._piniaInitialStateClient = pinia.state.value
    const { _piniaInitialState } = pageContext
    // @ts-ignore
    console.log('_piniaInitialState.counter.count', _piniaInitialState.counter.count)
    // @ts-ignore
    console.log('_piniaInitialState.persistedCounter.count', _piniaInitialState.persistedCounter.count)
    console.log('_piniaInitialState', _piniaInitialState)
    if (_piniaInitialState) {
      pinia.state.value = { ..._piniaInitialState }
    }
  }

  app.use(pageContext.globalContext.pinia ?? pageContext.pinia!)
}
