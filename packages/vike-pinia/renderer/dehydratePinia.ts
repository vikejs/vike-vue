import type { OnAfterRenderSSRApp } from 'vike-vue';
import type { PiniaAdditionalSSRContext } from './types';

export { dehydratePinia }

type PiniaOnAfterRenderSSRApp = OnAfterRenderSSRApp<PiniaAdditionalSSRContext>

const dehydratePinia: PiniaOnAfterRenderSSRApp = ({ pinia }): ReturnType<PiniaOnAfterRenderSSRApp> => {
  if (!pinia) {
    console.warn("[vike-pinia] Missing pinia from pageContext. Did you forget to use `installPinia()` in `+onCreateApp()`?")
    return
  }
  return { piniaInitialState: pinia.state.value }
}
