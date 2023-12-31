export type { PageProps }
export type { Component }

import type { defineComponent } from 'vue'

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Component = ReturnType<typeof defineComponent>

type PageProps = Record<string, unknown>

declare global {
  namespace Vike {
    interface PageContext {
      // Note: Page will typically be undefined in onRenderHtml() when setting the `ssr` config flag
      // to `false` (SPA mode).
      Page?: Component

      // TODO/next-major-release: remove pageProps (i.e. tell users to use data() instead of onBeforeRender() to fetch data)
      /** Properties of the page's root Vue component - e.g. set by onBeforeRender() hook */
      pageProps?: PageProps

      // TODO/next-major-release: remove support for setting title over onBeforeRender()
      /** &lt;title>${title}&lt;/title> - set by onBeforeRender() hook, has precedence over the config */
      title?: string

      lang?: string

      // Needed by getTitle()
      data?: {
        /** &lt;title>${title}&lt;/title> - set by data() hook, has precedence over the onBeforeRender() hook */
        title?: string
      }
    }
  }
}
