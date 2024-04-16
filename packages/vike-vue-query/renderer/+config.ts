import type { DehydratedState, QueryClientConfig } from "@tanstack/vue-query"

export default {
  // @ts-ignore Remove this ts-ignore once Vike's new version is released.
  name: 'vike-vue-query',
  onCreateAppVueQuery: 'import:vike-vue-query/renderer/installVueQuery:installVueQuery',
  onAfterRenderSSRAppVueQuery: 'import:vike-vue-query/renderer/dehydrateVueQuery:dehydrateVueQuery',
  onBeforeMountAppVueQuery: 'import:vike-vue-query/renderer/hydrateVueQuery:hydrateVueQuery',
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true
      }
    }
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      queryClient?: QueryClientConfig
      fromHtmlRenderer: {
        vueQueryInitialState?: DehydratedState
      }
    }
    interface ConfigVikeVue {
      queryClientConfig: QueryClientConfig
    }
  }
}
