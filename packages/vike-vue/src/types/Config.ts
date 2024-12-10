import type { ImportString, PageContextServer, PageContext, PageContextClient } from 'vike/types'
import type { TagAttributes } from '../utils/getTagAttributesString'
import type { Viewport } from '../integration/onRenderHtml'
import type { ConfigsCumulative } from '../hooks/useConfig/configsCumulative'
import type { Component } from './PageContext'
import type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnBeforeRenderHtmlSync,
  OnBeforeRenderHtmlAsync,
  OnAfterRenderHtmlSync,
  OnAfterRenderHtmlAsync,
  OnBeforeRenderClientSync,
  OnBeforeRenderClientAsync,
} from './VikeHooks'

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface Config {
      /**
       * Add arbitrary `<head>` tags.
       *
       * https://vike.dev/Head
       */
      Head?: Component

      /**
       * A component that defines the visual layout common to several pages.
       *
       * Technically: the `<Layout>` component wraps the root component `<Page>`.
       *
       * https://vike.dev/Layout
       */
      Layout?: Component

      /**
       * Set the page's tilte.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <title>{title}</title>
       *   <meta property="og:title" content={title} />
       * </head>
       * ```
       *
       * https://vike.dev/title
       */
      title?: string | null | ((pageContext: PageContext_) => string | null | undefined)

      /**
       * Set the page's description.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <meta name="description" content={description}>
       *   <meta property="og:description" content={description}>
       * </head>
       * ```
       *
       * https://vike.dev/description
       */
      description?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's preview image upon URL sharing.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <meta property="og:image" content={image}>
       *   <meta name="twitter:card" content="summary_large_image">
       * </head>
       * ```
       *
       * https://vike.dev/image
       */
      image?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's width shown to the user on mobile/tablet devices.
       *
       * @default "responsive"
       *
       * https://vike.dev/viewport
       */
      viewport?: Viewport | ((pageContext: PageContextServer) => Viewport | undefined)

      /**
       * Set the page's favicon.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <link rel="icon" href={favicon} />
       * </head>
       * ```
       *
       * https://vike.dev/favicon
       */
      favicon?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's language (`<html lang>`).
       *
       * @default 'en'
       *
       * https://vike.dev/lang
       */
      lang?: string | null | ((pageContext: PageContext_) => string | null | undefined)

      /**
       * Add tag attributes such as `<html class="dark">`.
       *
       * https://vike.dev/htmlAttributes
       */
      htmlAttributes?: TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined)

      /**
       * Add tag attributes such as `<body class="dark">`.
       *
       * https://vike.dev/bodyAttributes
       */
      bodyAttributes?: TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined)

      /**
       * If `true`, the page is rendered twice: on the server-side (to HTML) and on the client-side (hydration).
       *
       * If `false`, the page is rendered only once in the browser.
       *
       * @default true
       *
       * https://vike.dev/ssr
       */
      ssr?: boolean

      /**
       * Enable or disable HTML Streaming.
       *
       * https://vike.dev/stream
       */
      stream?: boolean | 'web'

      /**
       * The page's root Vue component.
       *
       * https://vike.dev/Page
       */
      Page?: Component

      /**
       * Raw HTML injected at the start of `<body>`.
       *
       * https://vike.dev/bodyHtmlBegin
       */
      bodyHtmlBegin?: BodyHtmlBoundary

      /**
       * Raw HTML injected at the end of `<body>`.
       *
       * @default `<div id="teleported"></div>`
       *
       * https://vike.dev/bodyHtmlEnd
       */
      bodyHtmlEnd?: BodyHtmlBoundary

      /**
       * Hook called right after creating Vue's `app` instance.
       *
       * Typically used for registering Vue plugins.
       *
       * https://vike.dev/onCreateApp
       */
      onCreateApp?: OnCreateAppSync | OnCreateAppAsync | ImportString

      /**
       * Hook called right before rendering the page's root Vue component to HTML.
       *
       * https://vike.dev/onBeforeRenderHtml
       */
      onBeforeRenderHtml?: OnBeforeRenderHtmlSync | OnBeforeRenderHtmlAsync | ImportString

      /**
       * Hook called right after rendering the page's root Vue component to HTML.
       *
       * https://vike.dev/onAfterRenderHtml
       */
      onAfterRenderHtml?: OnAfterRenderHtmlSync | OnAfterRenderHtmlAsync | ImportString

      /**
       * Hook called right before mounting the page's root Vue component.
       *
       * Typically used for hydrating state management libraries.
       *
       * https://vike.dev/onBeforeRenderClient
       */
      onBeforeRenderClient?: OnBeforeRenderClientSync | OnBeforeRenderClientAsync | ImportString

      /**
       * Client-side hook called after the page is rendered.
       *
       * https://vike.dev/onAfterRenderClient
       */
      onAfterRenderClient?: (pageContext: PageContextClient) => void
    }
    interface ConfigResolved {
      onCreateApp?: Array<OnCreateAppSync | OnCreateAppAsync>
      onBeforeRenderHtml?: Array<OnBeforeRenderHtmlSync | OnBeforeRenderHtmlAsync>
      onAfterRenderHtml?: Array<OnAfterRenderHtmlSync | OnAfterRenderHtmlAsync>
      onBeforeRenderClient?: Array<OnBeforeRenderClientSync | OnBeforeRenderClientAsync>
      onAfterRenderClient?: Function[]
      bodyHtmlBegin?: BodyHtmlBoundary[]
      bodyHtmlEnd?: BodyHtmlBoundary[]
      Layout?: Component[]
      Head?: Component[]
      bodyAttributes?: TagAttributes[]
      htmlAttributes?: TagAttributes[]
    }
  }
}

export type __FakeExport_Config = never

// Be able to reference it from within `namespace Vike`
// - https://stackoverflow.com/questions/46559021/typescript-use-of-global-type-inside-namespace-with-same-type
// - https://github.com/Microsoft/TypeScript/issues/983
type PageContext_ = PageContext

type BodyHtmlBoundary = string | ((pageContext: PageContext) => string)

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export const configsFromHook = [
  'Head',
  'title',
  'description',
  'image',
  'favicon',
  'lang',
  'viewport',
  'bodyAttributes',
  'htmlAttributes',
] as const
type ConfigsFromHook = (typeof configsFromHook)[number]
export type ConfigFromHook = PickWithoutGetter<Vike.Config, ConfigsFromHook>
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigsCumulative> &
  Pick<Vike.ConfigResolved, ConfigsCumulative>
