export { onAfterRenderHtml }

import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

const onAfterRenderHtml: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  const { pinia } = pageContext
  return { piniaInitialState: pinia!.state.value }
}
