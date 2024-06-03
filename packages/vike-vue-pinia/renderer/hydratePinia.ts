import type { OnBeforeRenderClientSync } from 'vike-vue/types'

export { hydratePinia }

const hydratePinia: OnBeforeRenderClientSync = ({
  pinia,
  fromHtmlRenderer,
  isHydration,
}): ReturnType<OnBeforeRenderClientSync> => {
  if (!isHydration) {
    return
  }

  const { piniaInitialState } = fromHtmlRenderer

  if (!pinia || !piniaInitialState) {
    // happens if SSR is off
    return
  }

  pinia.state.value = piniaInitialState
}
