export { onCreateApp }

import { createPinia } from 'pinia'
import type { OnCreateAppSync } from 'vike-vue/types'

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  installPinia(pageContext)
}

type PageContext = Parameters<typeof onCreateApp>[0]
function installPinia(pageContext: PageContext) {
  const pinia = createPinia()
  pageContext.app.use(pinia)
  Object.assign(pageContext, { pinia })
}
