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

      /** Properties of the page's root Vue component. */
      pageProps?: PageProps

      /** &lt;title>${title}&lt;/title> - has precedence over the config */
      title?: string
    }
  }
}
