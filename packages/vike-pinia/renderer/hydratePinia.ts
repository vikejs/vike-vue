import type { OnBeforeMountApp } from 'vike-vue'
import type { PiniaAdditionalSSRContext } from "./types"

export { hydratePinia }

type PiniaOnBeforeMountApp = OnBeforeMountApp<PiniaAdditionalSSRContext>

const hydratePinia: PiniaOnBeforeMountApp = ({ pinia, fromHtmlRenderer }): ReturnType<PiniaOnBeforeMountApp> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }

  const { piniaInitialState } = fromHtmlRenderer

  if (!piniaInitialState) {
    console.warn("[vike-pinia] No initial state was found. Did you forget to return `initialStoreState` from `+onRenderHtml()`?")
    return
  }

  pinia.state.value = piniaInitialState
}
