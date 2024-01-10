import type { OnBeforeMountApp } from 'vike-vue'

export { hydratePinia }

const hydratePinia: OnBeforeMountApp = ({ pinia, initialStoreState }): ReturnType<OnBeforeMountApp> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }

  if (!initialStoreState) {
    console.warn("[vike-pinia] No initial state was found. Did you forget to return `initialStoreState` from `+onRenderHtml()`?")
    return
  }

  pinia.state.value = initialStoreState
}
