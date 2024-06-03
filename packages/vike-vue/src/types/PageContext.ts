export type { Component }
export type { PageContextWithApp, PageContextWithoutApp }

import type { PageContext } from 'vike/types'
import type { App, defineComponent } from 'vue'
import type {
  OnAfterRenderSSRAppAsync,
  OnAfterRenderSSRAppSync,
  OnBeforeMountAppAsync,
  OnBeforeMountAppSync,
  OnCreateAppAsync,
  OnCreateAppSync,
} from '../hooks/types'

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Component = ReturnType<typeof defineComponent>

type PageContextWithoutApp = PageContext & { app: undefined }
type PageContextWithApp = PageContext & { app: App }

declare global {
  namespace Vike {
    interface PageContext {
      // Page is undefined in onRenderHtml() when setting the `ssr` config flag to `false`
      Page?: Component

      // Set by createVueApp()
      app?: App

      // Set by onRenderHtml()
      fromHtmlRenderer: Record<string, unknown>
    }
    interface ConfigResolved {
      onCreateApp?: Array<OnCreateAppSync | OnCreateAppAsync>
      onAfterRenderSSRApp?: Array<OnAfterRenderSSRAppSync | OnAfterRenderSSRAppAsync>
      onBeforeMountApp?: Array<OnBeforeMountAppSync | OnBeforeMountAppAsync>
    }
  }
}
