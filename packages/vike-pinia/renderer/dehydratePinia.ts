import type { DehydrateStore } from 'vike-vue';

export { dehydratePinia }

const dehydratePinia: DehydrateStore = ({ pinia }): ReturnType<DehydrateStore> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }
  return pinia.state.value
}
