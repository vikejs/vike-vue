export { onBeforeRenderClient }

import type { OnBeforeRenderClientSync } from 'vike-vue/types'

const onBeforeRenderClient: OnBeforeRenderClientSync = (pageContext): ReturnType<OnBeforeRenderClientSync> => {
  hydratePinia(pageContext)
}

type PageContext = Parameters<typeof onBeforeRenderClient>[0]
function hydratePinia(pageContext: PageContext) {
  if (!pageContext.isHydration) {
    return
  }
  const { pinia } = pageContext
  const piniaInitialState = pageContext._piniaInitialState
  if (!pinia || !piniaInitialState) {
    // happens if SSR is off
    return
  }
  pinia.state.value = piniaInitialState
}
