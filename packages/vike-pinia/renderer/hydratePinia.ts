import type { OnBeforeMountApp } from 'vike-vue'
import type { PiniaAdditionalSSRContext } from "./types"

export { hydratePinia }

type PiniaOnBeforeMountApp = OnBeforeMountApp<PiniaAdditionalSSRContext>

const hydratePinia: PiniaOnBeforeMountApp = ({ pinia, fromHtmlRenderer }): ReturnType<PiniaOnBeforeMountApp> => {
  const { piniaInitialState } = fromHtmlRenderer

  if (!pinia || !piniaInitialState) {
    // happens if SSR is off
    return
  }

  pinia.state.value = piniaInitialState
}
