import { createPinia } from 'pinia'
import type { OnCreateAppSync } from 'vike-vue/types'

export { onCreateApp }

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  const pinia = createPinia()
  pageContext.app.use(pinia)
  Object.assign(pageContext, { pinia })
}
