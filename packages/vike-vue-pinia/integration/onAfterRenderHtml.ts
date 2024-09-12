export { onAfterRenderHtml }

import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const onAfterRenderHtml: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  return dehydratePinia(pageContext)
}

type PageContext = Parameters<typeof onAfterRenderHtml>[0]
function dehydratePinia(pageContext: PageContext) {
  const { pinia } = pageContext
  return { piniaInitialState: pinia!.state.value }
}
