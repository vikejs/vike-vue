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
  const {
    pinia,
    fromHtmlRenderer: { piniaInitialState },
  } = pageContext
  if (!pinia || !piniaInitialState) {
    // happens if SSR is off
    return
  }
  // @ts-expect-error TODO: fix type mismatch between Config['fromHtmlRenderer'] set by vike-vue and vike-vue-pinia
  pinia.state.value = piniaInitialState
}
