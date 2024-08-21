export type { Component }

import type { App } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import type { ConfigFromHookResolved } from './Config'
import type { PageHtmlStream } from '../renderer/onRenderHtml'

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

      /** The +Page.vue component rendered to the HTML string. */
      pageHtmlString?: string
      /** The +Page.vue component rendered to an HTML stream. */
      pageHtmlSteam?: PageHtmlStream

      // https://vike.dev/onCreateApp
      isRenderingHead?: boolean
    }
  }
}

export type __FakeExport_PageContext = never

// Internal usage
export type PageContextInternal = {
  _configFromHook?: ConfigFromHookResolved
  // We use a wrapper because of https://github.com/vikejs/vike-vue/issues/181
  _headAlreadySetWrapper?: { val: boolean }
}
