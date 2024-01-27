export type { Component }
export type { PageContextWithApp, PageContextWithoutApp }
export type { VikeVueApp }

import type { PageContext } from 'vike/types'
import type { App, defineComponent } from 'vue'

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Component = ReturnType<typeof defineComponent>

type VikeVueApp = App<Element> & {
  changePage: (pageContext: PageContext) => Promise<void>
}

type PageContextWithoutApp = PageContext & { app: undefined }
type PageContextWithApp = PageContext & { app: VikeVueApp }

declare global {
  namespace Vike {
    interface PageContext {
      // Page is undefined in onRenderHtml() when setting the `ssr` config flag to `false`
      Page?: Component

      // Set by createVueApp()
      app?: VikeVueApp

      // Set by onRenderHtml()
      fromHtmlRenderer: unknown
    }
  }
}
