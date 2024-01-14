import { createPinia } from 'pinia'
import type { OnCreateAppSync } from 'vike-vue'
import { assert } from '../utils/assert'

export { installPinia }

const installPinia: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  const pinia = createPinia()
  assert(pageContext.app)
  pageContext.app.use(pinia)
  Object.assign(pageContext, { pinia })
}
