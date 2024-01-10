import type { HydrateStore } from 'vike-vue'

export { hydratePinia }

const hydratePinia: HydrateStore = ({ pinia, initialStoreState }): ReturnType<HydrateStore> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }

  if (!initialStoreState) {
    console.warn("[vike-pinia] No initial state was found. Did you forget to pass `initialStoreState` to `onRenderHtml()`?")
    return
  }

  pinia.state.value = initialStoreState
}
