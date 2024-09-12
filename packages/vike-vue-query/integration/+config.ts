import type { DehydratedState, QueryClient, QueryClientConfig } from '@tanstack/vue-query'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

export default {
  name: 'vike-vue-query',
  require: {
    'vike-vue': '>=0.7.0',
  },
  onCreateApp: 'import:vike-vue-query/__internal/integration/installVueQuery:installVueQuery',
  onAfterRenderHtml: 'import:vike-vue-query/__internal/integration/dehydrateVueQuery:dehydrateVueQuery',
  onBeforeRenderClient: 'import:vike-vue-query/__internal/integration/hydrateVueQuery:hydrateVueQuery',
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true,
      },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      queryClient?: QueryClient
      _vueQueryInitialState?: DehydratedState
    }
  }
  namespace Vike {
    interface Config {
      queryClientConfig?: QueryClientConfig
    }
  }
}
