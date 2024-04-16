import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { OnCreateAppSync } from 'vike-vue/types'

export { installVueQuery }

const installVueQuery: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  // TODO: Add a way to configure the options.
  const queryClient = new QueryClient(pageContext.config.queryClientConfig);
  pageContext.app.use(VueQueryPlugin, { queryClient })
  Object.assign(pageContext, { queryClient })
}
