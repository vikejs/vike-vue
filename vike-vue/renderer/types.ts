export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }
export type { Page }
export type { Component }

import type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
} from 'vite-plugin-ssr/types'
import type { Config } from './+config'
import type { ComponentPublicInstance } from 'vue'

type Component = ComponentPublicInstance // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086

type Page = Component
type PageProps = Record<string, unknown>
type WrapperComponent = Component

export type PageContextCommon = {
  Page: Page
  pageProps?: PageProps
  config: {
    Layout?: WrapperComponent
    Wrapper?: WrapperComponent
  }
}

type PageContextServer = PageContextBuiltIn<Page> &
  PageContextCommon & {
    config: Config
  }
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCommon
type PageContext = PageContextClient | PageContextServer
