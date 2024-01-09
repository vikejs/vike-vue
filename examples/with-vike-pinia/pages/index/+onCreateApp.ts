// when overwriting the default `onCreateApp` function, we can just import `installPinia` and call it

import type { OnCreateAppSync } from 'vike-vue/.'
import { installPinia } from 'vike-pinia/renderer/installPinia'

export { onCreateApp }

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  console.log('custom onCreateApp')
  installPinia(pageContext)

  // installing other plugins, etc.
}
