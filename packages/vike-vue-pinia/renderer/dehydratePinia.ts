import type { OnAfterRenderSSRAppSync } from 'vike-vue/types'

export { dehydratePinia }

const dehydratePinia: OnAfterRenderSSRAppSync = ({ pinia }): ReturnType<OnAfterRenderSSRAppSync> => {
  return { piniaInitialState: pinia!.state.value }
}
