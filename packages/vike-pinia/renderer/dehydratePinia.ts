import type { OnAfterRenderSSRApp } from 'vike-vue';

export { dehydratePinia }

const dehydratePinia: OnAfterRenderSSRApp = ({ pinia }): ReturnType<OnAfterRenderSSRApp> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }
  return pinia.state.value
}
