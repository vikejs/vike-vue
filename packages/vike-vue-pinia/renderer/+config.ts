import type { Pinia, StateTree } from 'pinia'

export default {
  name: 'vike-vue-pinia',
  onCreateApp: 'import:vike-vue-pinia/renderer/installPinia:installPinia',
  onAfterRenderHtml: 'import:vike-vue-pinia/renderer/dehydratePinia:dehydratePinia',
  onBeforeRenderClient: 'import:vike-vue-pinia/renderer/hydratePinia:hydratePinia',
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
