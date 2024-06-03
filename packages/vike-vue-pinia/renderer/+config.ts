import type { Pinia, StateTree } from 'pinia'

export default {
  name: 'vike-vue-pinia',
  onCreateApp: 'import:vike-vue-pinia/renderer/installPinia:installPinia',
  onAfterRenderSSRApp: 'import:vike-vue-pinia/renderer/dehydratePinia:dehydratePinia',
  onBeforeMountApp: 'import:vike-vue-pinia/renderer/hydratePinia:hydratePinia',
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
