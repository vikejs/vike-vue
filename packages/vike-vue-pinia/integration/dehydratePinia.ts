import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

export { dehydratePinia }

const dehydratePinia: OnAfterRenderHtmlSync = (pageContext): ReturnType<OnAfterRenderHtmlSync> => {
  const { pinia } = pageContext
  return { piniaInitialState: pinia!.state.value }
}
