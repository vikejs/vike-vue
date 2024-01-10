import type { Pinia } from 'pinia'

export default {
  onCreateApp: 'import:vike-pinia/renderer/installPinia:installPinia',
  onAfterRenderSSRApp: 'import:vike-pinia/renderer/dehydratePinia:dehydratePinia',
  onBeforeMountApp: 'import:vike-pinia/renderer/hydratePinia:hydratePinia',
}

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
    }
  }
}
