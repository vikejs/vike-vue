import type { DehydratedState, QueryClient, QueryClientConfig } from '@tanstack/vue-query'

export default {
  name: 'vike-vue-query',
  onCreateApp: 'import:vike-vue-query/renderer/installVueQuery:installVueQuery',
  onAfterRenderSSRApp: 'import:vike-vue-query/renderer/dehydrateVueQuery:dehydrateVueQuery',
  onBeforeMountApp: 'import:vike-vue-query/renderer/hydrateVueQuery:hydrateVueQuery',
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
