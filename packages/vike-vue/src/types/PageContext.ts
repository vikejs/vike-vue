export type { Component }

import type { App } from 'vue'
import type {
  BodyInjectHtml,
  OnAfterRenderHtmlAsync,
  OnAfterRenderHtmlSync,
  OnBeforeRenderClientAsync,
  OnBeforeRenderClientSync,
  OnCreateAppAsync,
  OnCreateAppSync,
} from '../hooks/types'
import type { SSRContext } from 'vue/server-renderer'

// https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
// TODO: use ComponentPublicInstance
type Component = any

declare global {
  namespace Vike {
    interface PageContext {
      // Page is undefined in onRenderHtml() when setting the `ssr` config flag to `false`
      Page?: Component

      // Set by createVueApp()
      app?: App

      // Set by onRenderHtml()
      fromHtmlRenderer: Record<string, unknown>

      ssrContext?: SSRContext
    }
    interface ConfigResolved {
      onCreateApp?: Array<OnCreateAppSync | OnCreateAppAsync>
      onAfterRenderHtml?: Array<OnAfterRenderHtmlSync | OnAfterRenderHtmlAsync>
      onBeforeRenderClient?: Array<OnBeforeRenderClientSync | OnBeforeRenderClientAsync>
      bodyHtmlBegin?: BodyInjectHtml[]
      bodyHtmlEnd?: BodyInjectHtml[]
      Layout?: Component[]
    }
  }
}
