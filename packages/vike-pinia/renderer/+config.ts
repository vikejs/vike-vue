import type { Pinia } from 'pinia'

export default {
  onCreateApp: 'import:vike-pinia/renderer/installPinia:installPinia',
  dehydrateStore: 'import:vike-pinia/renderer/dehydratePinia:dehydratePinia',
  hydrateStore: 'import:vike-pinia/renderer/hydratePinia:hydratePinia',
}

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
    }
  }
}
