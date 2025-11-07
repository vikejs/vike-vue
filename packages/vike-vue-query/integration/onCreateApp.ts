export { onCreateApp }

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { PageContext } from 'vike/types'

const onCreateApp = (pageContext: PageContext) => {
  installVueQuery(pageContext)
}

type PageContextWithApp = Parameters<typeof onCreateApp>[0]
function installVueQuery(pageContext: PageContextWithApp) {
  const queryClient = new QueryClient(pageContext.config.queryClientConfig)
  pageContext.app!.use(VueQueryPlugin, { queryClient })
  Object.assign(pageContext, { queryClient })
}
