export { onCreateApp }

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { OnCreateAppSync } from 'vike-vue/types'

const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  const queryClient = new QueryClient(pageContext.config.queryClientConfig)
  pageContext.app.use(VueQueryPlugin, { queryClient })
  Object.assign(pageContext, { queryClient })
}
