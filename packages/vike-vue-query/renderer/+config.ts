import type { DehydratedState, QueryClient, QueryClientConfig } from '@tanstack/vue-query'

export default {
  name: 'vike-vue-query',
  require: {
    'vike-vue': '>=0.7.0',
  },
  onCreateApp: 'import:vike-vue-query/renderer/installVueQuery:installVueQuery',
  onAfterRenderHtml: 'import:vike-vue-query/renderer/dehydrateVueQuery:dehydrateVueQuery',
  onBeforeRenderClient: 'import:vike-vue-query/renderer/hydrateVueQuery:hydrateVueQuery',
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true,
      },
    },
  },
}

declare global {
  namespace Vike {
    interface PageContext {
      queryClient?: QueryClient
      fromHtmlRenderer: {
        vueQueryInitialState?: DehydratedState
      }
    }
  }
  namespace VikePackages {
    interface ConfigVikeVue {
      queryClientConfig: QueryClientConfig
    }
  }
}
