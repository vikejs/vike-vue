import type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnAfterRenderHtmlSync,
  OnAfterRenderHtmlAsync,
  OnBeforeRenderClientSync,
  OnBeforeRenderClientAsync,
  BodyInjectHtml,
} from './hooks/types'

import type {
  Config,
  ConfigEffect,
  ImportString,
  PageContextServer,
  // Rename it to `PageContext_` to be able to reference it from within `namespace Vike`
  // - https://stackoverflow.com/questions/46559021/typescript-use-of-global-type-inside-namespace-with-same-type
  // - https://github.com/Microsoft/TypeScript/issues/983
  PageContext as PageContext_,
  PageContextClient,
} from 'vike/types'

import type { Component } from './types/PageContext'
import type { TagAttributes } from './utils/getTagAttributesString'
import type { Viewport } from './renderer/onRenderHtml'

// Depending on the value of `config.meta.ssr`, set other config options' `env`
// accordingly.
// See https://vike.dev/meta#:~:text=Modifying%20the%20environment%20of%20existing%20hooks
const toggleSsrRelatedConfig: ConfigEffect = ({ configDefinedAt, configValue }) => {
  if (typeof configValue !== 'boolean') {
    throw new Error(`${configDefinedAt} should be a boolean`)
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
          ? { server: true, client: true } // default
          : { client: true },
      },
    },
  }
}

export default {
  name: 'vike-vue',
  require: {
    vike: '>=0.4.183',
  },

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-vue/renderer/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-vue/renderer/onRenderClient:onRenderClient',

  // https://vike.dev/passToClient
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient: ['fromHtmlRenderer', '_configFromHook'],

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true },
      cumulative: true,
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    image: {
      env: { server: true },
    },
    viewport: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
      global: true,
    },
    lang: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: toggleSsrRelatedConfig,
    },
    stream: {
      env: { server: true },
    },
    onCreateApp: {
      env: { server: true, client: true },
      cumulative: true,
    },
    onAfterRenderHtml: {
      env: { server: true },
      cumulative: true,
    },
    onBeforeRenderClient: {
      env: { server: false, client: true },
      cumulative: true,
    },
    onAfterRenderClient: {
      env: { server: false, client: true },
      cumulative: true,
    },
    bodyHtmlBegin: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    bodyHtmlEnd: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    htmlAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    bodyAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
  },
} satisfies Config

// We purposely define the ConfigVikeVue interface in this file: that way we ensure it's always applied whenever the user `import vikeVue from 'vike-vue/config'`
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
      title?: string | ((pageContext: PageContext_) => string)

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
      description?: string | ((pageContext: PageContextServer) => string)

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
      image?: string | ((pageContext: PageContextServer) => string)

      /**
       * Set the page's width shown to the user on mobile/tablet devices.
       *
       * @default "responsive"
       *
       * https://vike.dev/viewport
       */
      viewport?: Viewport

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
      favicon?: string

      /**
       * Set the page's language (`<html lang>`).
       *
       * @default 'en'
       *
       * https://vike.dev/lang
       */
      lang?: string | ((pageContext: PageContext_) => string) | null

      /**
       * Add tag attributes such as `<html class="dark">`.
       *
       * https://vike.dev/htmlAttributes
       */
      htmlAttributes?: TagAttributes

      /**
       * Add tag attributes such as `<body class="dark">`.
       *
       * https://vike.dev/bodyAttributes
       */
      bodyAttributes?: TagAttributes

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
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       * If true, the stream will be a Node Stream. If you need a Web Stream, use `stream: 'web'`.
       *
       * @default false
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
       * The result of this is injected at the start of `<body>`.
       *
       * https://vike.dev/bodyHtmlBegin
       */
      bodyHtmlBegin?: BodyInjectHtml

      /**
       * The result of this is injected at the end of `<body>`.
       *
       * @default `<div id="teleported"></div>`
       *
       * https://vike.dev/bodyHtmlEnd
       */
      bodyHtmlEnd?: BodyInjectHtml

      /**
       * Hook called right after creating Vue's `app` instance.
       *
       * Typically used for registering Vue plugins.
       *
       * https://vike.dev/onCreateApp
       */
      onCreateApp?: OnCreateAppSync | OnCreateAppAsync | ImportString

      /**
       * Hook called right after rendering the page's root Vue component.
       * The hook can return additional page context that will be passed to the client under `pageContext.fromHtmlRenderer`.
       *
       * Typically used for dehydrating state management libraries.
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
      onAfterRenderHtml?: Array<OnAfterRenderHtmlSync | OnAfterRenderHtmlAsync>
      onBeforeRenderClient?: Array<OnBeforeRenderClientSync | OnBeforeRenderClientAsync>
      onAfterRenderClient?: Function[]
      bodyHtmlBegin?: BodyInjectHtml[]
      bodyHtmlEnd?: BodyInjectHtml[]
      Layout?: Component[]
      Head?: Component[]
      bodyAttributes?: TagAttributes[]
      htmlAttributes?: TagAttributes[]
    }
  }
}

// This is a workaround for
// * https://github.com/vuejs/core/issues/8303
// * https://github.com/esbuild-kit/tsx/issues/113
// Without this, when running vike-vue with tsx (for example when scaffolding a
// Vue+Express project with Bati), querying the server will fail with the
// following error:
//     [vike][request(1)] HTTP request: /
//     [vite][request(1)] __name is not defined
//     [vite][request(1)] __name is not defined
//     [vite][request(1)] __name is not defined
//     [vite][request(1)] Error when evaluating SSR module virtual:vike:importPageCode:server:/pages/index: failed to import "/pages/index/+Page.vue"
//     |- ReferenceError: __name is not defined
const globalName = (target: Object, value: string) =>
  Object.defineProperty(target, 'name', {
    value,
    configurable: true,
  })
declare global {
  var __name: typeof globalName
}
globalThis.__name = globalName
