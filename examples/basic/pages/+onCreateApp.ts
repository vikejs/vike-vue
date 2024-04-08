// https://vike.dev/onCreateApp
export { onCreateApp }

import type { OnCreateAppSync } from 'vike-vue'
import ToastPlugin from 'vue-toast-notification'

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  const { app } = pageContext
  app.use(ToastPlugin)
  console.log(`Vue version: ${app.version}`)
}
