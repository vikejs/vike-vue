import type { OnAfterRenderSSRApp } from 'vike-vue';
import type { PiniaAdditionalSSRContext } from './types';

export { dehydratePinia }

type PiniaOnAfterRenderSSRApp = OnAfterRenderSSRApp<PiniaAdditionalSSRContext>

const dehydratePinia: PiniaOnAfterRenderSSRApp = ({ pinia }): ReturnType<PiniaOnAfterRenderSSRApp> => {
  return { piniaInitialState: pinia!.state.value }
}
