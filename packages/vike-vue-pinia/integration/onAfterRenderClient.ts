export { onAfterRenderClient }

import type { PageContextClient } from 'vike/types'

function onAfterRenderClient(pageContext: PageContextClient) {
  if (!pageContext.isHydration) return
  if (!pageContext._piniaInitialStateClient) return

  const pinia = pageContext.globalContext.pinia ?? pageContext.pinia
  if (!pinia) return

  // Restore client-side persisted state after hydration
  pinia.state.value = pageContext._piniaInitialStateClient
}
