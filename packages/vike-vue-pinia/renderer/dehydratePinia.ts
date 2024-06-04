import type { OnAfterRenderHtmlSync } from 'vike-vue/types'

export { dehydratePinia }

const dehydratePinia: OnAfterRenderHtmlSync = ({ pinia }): ReturnType<OnAfterRenderHtmlSync> => {
  return { piniaInitialState: pinia!.state.value }
}
