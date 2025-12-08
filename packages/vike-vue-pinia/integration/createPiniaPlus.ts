export { createPiniaPlus }

import { createPinia } from 'pinia'
import type { PageContext } from 'vike/types'

// Call createPinia() and +onCreatePinia hooks
async function createPiniaPlus(pageContext: PageContext, useGloablContext?: boolean) {
  const pinia = createPinia()

  if (useGloablContext) {
    // Implicitly sets pageContext.pinia (because pageContext inherits all (as fallback) globalContext properties)
    pageContext.globalContext.pinia = pinia
  } else {
    pageContext.pinia = pinia
  }

  // Call +onCreatePinia hooks
  const { onCreatePinia } = pageContext.config
  if (onCreatePinia) {
    await Promise.all(onCreatePinia.map((hook) => hook(pageContext)))
  }

  return pinia
}
