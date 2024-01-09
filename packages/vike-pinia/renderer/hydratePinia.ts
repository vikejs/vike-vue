import type { HydrateStore } from 'vike-vue'

export { hydratePinia }

const hydratePinia: HydrateStore = ({ app, initialStoreState }): ReturnType<HydrateStore> => {
  if (!initialStoreState) {
    console.warn("[vike-pinia] No initial state was found. Did you forget to pass `initialStoreState` to `onRenderHtml`?")
    return
  }

  app.config.globalProperties.$pinia.state.value = initialStoreState
}
