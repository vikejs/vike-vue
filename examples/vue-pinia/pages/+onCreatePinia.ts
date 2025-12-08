import type { PageContext } from 'vike/types'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function onCreatePinia(pageContext: PageContext) {
  // Only register persistence plugin on client-side (it uses localStorage)
  if (pageContext.isClientSide) {
    pageContext.pinia!.use(piniaPluginPersistedstate)
  }
}
