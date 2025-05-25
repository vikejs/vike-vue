export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContextServer) {
  pageContext._piniaInitialState = pageContext.pinia?.state.value
}
