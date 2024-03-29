import type { Pinia, StateTree } from 'pinia'

export default {
  // @ts-ignore Remove this ts-ignore once Vike's new version is released.
  name: 'vike-pinia',
  onCreateAppPinia: 'import:vike-pinia/renderer/installPinia:installPinia',
  onAfterRenderSSRApp: 'import:vike-pinia/renderer/dehydratePinia:dehydratePinia',
  onBeforeMountApp: 'import:vike-pinia/renderer/hydratePinia:hydratePinia'
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
