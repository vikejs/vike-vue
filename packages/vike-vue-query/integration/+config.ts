export { config as default }

import type { DehydratedState, QueryClient, QueryClientConfig } from '@tanstack/vue-query'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

const config = {
  name: 'vike-vue-query',
  require: {
    'vike-vue': '^0.7.0 || ^0.8.0',
  },
  passToClient: ['_vueQueryInitialState'],
  onCreateApp: 'import:vike-vue-query/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-query/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderClient: 'import:vike-vue-query/__internal/integration/onBeforeRenderClient:onBeforeRenderClient',
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
