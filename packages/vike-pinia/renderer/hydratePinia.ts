import type { OnBeforeMountAppSync } from 'vike-vue'

export { hydratePinia }

const hydratePinia: OnBeforeMountAppSync = ({ pinia, fromHtmlRenderer }): ReturnType<OnBeforeMountAppSync> => {
  const { piniaInitialState } = fromHtmlRenderer

  if (!pinia || !piniaInitialState) {
    // happens if SSR is off
    return
  }

  pinia.state.value = piniaInitialState
}
