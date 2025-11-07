export { onCreateApp }

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { PageContext } from 'vike/types'

const onCreateApp = (pageContext: PageContext) => {
  installVueQuery(pageContext)
}

function installVueQuery(pageContext: PageContext) {
  const queryClient = new QueryClient(pageContext.config.queryClientConfig)
  pageContext.app!.use(VueQueryPlugin, { queryClient })
  Object.assign(pageContext, { queryClient })
}
