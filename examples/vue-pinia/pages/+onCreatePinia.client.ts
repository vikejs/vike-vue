import type { PageContext } from 'vike/types'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function onCreatePinia(pageContext: PageContext) {
  pageContext.pinia!.use(piniaPluginPersistedstate)
}
