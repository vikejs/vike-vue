export type { PageProps }
export type { Component }

import type { defineComponent } from 'vue'

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Component = ReturnType<typeof defineComponent>

type PageProps = Record<string, unknown>

declare global {
  namespace Vike {
    interface PageContext {
      Page: Component
      pageProps: PageProps
      title?: string
    }
  }
}
