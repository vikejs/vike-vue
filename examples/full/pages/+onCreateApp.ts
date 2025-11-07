// https://vike.dev/onCreateApp
export { onCreateApp }

import type { PageContext } from 'vike/types'
import ToastPlugin from 'vue-toast-notification'

const onCreateApp = (pageContext: PageContext) => {
  if (pageContext.isRenderingHead) return
  const app = pageContext.app!
  app.use(ToastPlugin)
  console.log(`Vue version: ${app.version}`)
}
