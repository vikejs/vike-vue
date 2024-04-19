import type { Pinia, StateTree } from 'pinia'

export default {
  name: 'vike-pinia',
  onCreateAppPinia: 'import:vike-pinia/renderer/installPinia:installPinia',
  onAfterRenderSSRAppPinia: 'import:vike-pinia/renderer/dehydratePinia:dehydratePinia',
  onBeforeMountAppPinia: 'import:vike-pinia/renderer/hydratePinia:hydratePinia'
}

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
      fromHtmlRenderer: {
        piniaInitialState?: StateTree
      }
    }
  }
}
