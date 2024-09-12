export { onAfterRenderHtml }

import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const onAfterRenderHtml: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  dehydratePinia(pageContext)
}

type PageContext = Parameters<typeof onAfterRenderHtml>[0]
function dehydratePinia(pageContext: PageContext) {
  const { pinia } = pageContext
  pageContext._piniaInitialState = pinia!.state.value
}
