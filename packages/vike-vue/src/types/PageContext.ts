export type { Component }

import type { App } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import type { ConfigViaHookResolved } from './Config'
import type { PageHtmlStream } from '../integration/onRenderHtml'

// https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
// TO-DO/eventually: use ComponentPublicInstance
type Component = any

declare global {
  namespace Vike {
    interface PageContext {
      // Page is undefined in onRenderHtml() when setting the `ssr` config flag to `false`
      Page?: Component

      // Set by createVueApp()
      app?: App

      // TO-DO/eventually: remove (vike-vue-pinia and vike-vue-query don't use this anymore).
      // - Let's wait a bit before removing as old vike-vue-pinia and vike-vue-query versions still need this.
      /** @deprecated */
      fromHtmlRenderer: Record<string, unknown>

      ssrContext?: SSRContext

      /** The +Page.vue component rendered to the HTML string. */
      pageHtmlString?: string
      /** The +Page.vue component rendered to an HTML stream. */
      pageHtmlStream?: PageHtmlStream

      // https://vike.dev/onCreateApp
      isRenderingHead?: boolean
    }
  }
}

export type __FakeExport_PageContext = never

// Internal usage
export type PageContextInternal = {
  _configViaHook?: ConfigViaHookResolved
  // We use a wrapper because of https://github.com/vikejs/vike-vue/issues/181
  _headAlreadySetWrapper?: { val: boolean }
}
