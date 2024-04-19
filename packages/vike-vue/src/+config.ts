export { config }

import type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnAfterRenderSSRAppSync,
  OnAfterRenderSSRAppAsync,
  OnBeforeMountAppSync,
  OnBeforeMountAppAsync
} from './hooks/types'

import type { Config, ConfigEffect, PageContext } from 'vike/types'
import type { Component } from './types/PageContext'
import type { Plugin } from 'vue'

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
          : { client: true }
      }
    }
  }
}

const config = {
  name: 'vike-vue',

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-vue/renderer/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-vue/renderer/onRenderClient:onRenderClient',

  // https://vike.dev/passToClient
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient: ['fromHtmlRenderer'],

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true }
    },
    Layout: {
      env: { server: true, client: true }
    },
    title: {
      env: { server: true, client: true }
    },
    favicon: {
      env: { server: true, client: true }
    },
    lang: {
      env: { server: true, client: true }
    },
    ssr: {
      env: { config: true },
      effect: toggleSsrRelatedConfig
    },
    stream: {
      env: { server: true }
    },
    vuePlugins: {
      // List of vue plugins to be installed with app.vue() in onRenderHtml and
      // onRenderClient. We make this config available both on the server and
      // the client always, but if SSR is disabled, onRenderHtml won't make use
      // of it.
      env: { server: true, client: true }
    },
    onCreateApp: {
      env: { server: true, client: true }
    },
    onCreateAppPinia: {
      env: { server: true, client: true }
    },
    onCreateAppVueQuery: {
      env: { server: true, client: true }
    },
    onAfterRenderSSRApp: {
      env: { server: true }
    },
    onAfterRenderSSRAppPinia: {
      env: { server: true }
    },
    onAfterRenderSSRAppVueQuery: {
      env: { server: true }
    },
    onBeforeMountApp: {
      env: { server: false, client: true }
    },
    onBeforeMountAppPinia: {
      env: { server: false, client: true }
    },
    onBeforeMountAppVueQuery: {
      env: { server: false, client: true }
    },
    // Vike already defines the setting 'name', but we redundantly define it here for older Vike versions (otherwise older Vike versions will complain that 'name` is an unknown config).
    name: {
      env: { config: true }
    }
  }
} satisfies Config

type VuePluginWithOptions = {
  plugin: Plugin
  options?: any
}

// We purposely define the ConfigVikeVue interface in this file: that way we ensure it's always applied whenever the user `import vikeVue from 'vike-vue/config'`
// https://vike.dev/pageContext#typescript
declare global {
  namespace VikePackages {
    interface ConfigVikeVue {
      /** Vue component rendered and appended into &lt;head>&lt;/head> */
      Head?: Component

      Layout?: Component

      /** &lt;title>${title}&lt;/title> */
      title?: string | ((pageContext: PageContext) => string)

      /** &lt;link rel="icon" href="${favicon}" /> */
      favicon?: string

      /** &lt;html lang="${lang}">
       *
       *  @default 'en'
       *
       */
      lang?: string

      /**
       * If `true`, the page is rendered twice: on the server-side (to HTML) and on the client-side (hydration).
       *
       * If `false`, the page is rendered only once in the browser.
       *
       * https://vike.dev/ssr
       *
       * @default true
       *
       */
      ssr?: boolean

      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean

      /** @deprecated Use `onCreateApp()` instead. */
      vuePlugins?: VuePluginWithOptions[]

      /** The page's root Vue component */
      Page?: Component

      /**
       * Hook called right after creating Vue's `app` instance.
       *
       * Typically used for registering Vue plugins.
       *
       * See https://vike.dev/onCreateApp
       */
      onCreateApp?: OnCreateAppSync | OnCreateAppAsync

      /**
       * Temporary workaround until `cumulative` is implemented for `onCreateApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onCreateAppPinia?: OnCreateAppSync

      /**
       * Temporary workaround until `cumulative` is implemented for `onCreateApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onCreateAppVueQuery?: OnCreateAppSync

      /**
       * Hook called right after rendering the page's root Vue component.
       * The hook can return additional page context that will be passed to the client under `pageContext.fromHtmlRenderer`.
       *
       * Typically used for dehydrating state management libraries.
       */
      onAfterRenderSSRApp?: OnAfterRenderSSRAppSync | OnAfterRenderSSRAppAsync

      /**
       * Temporary workaround until `cumulative` is implemented for `onAfterRenderSSRApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onAfterRenderSSRAppPinia?: OnAfterRenderSSRAppSync

      /**
       * Temporary workaround until `cumulative` is implemented for `onAfterRenderSSRApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onAfterRenderSSRAppVueQuery?: OnAfterRenderSSRAppSync

      /**
       * Hook called right before mounting the page's root Vue component.
       *
       * Typically used for hydrating state management libraries.
       */
      onBeforeMountApp?: OnBeforeMountAppSync | OnBeforeMountAppAsync

      /**
       * Temporary workaround until `cumulative` is implemented for `onBeforeMountApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onBeforeMountAppPinia?: OnBeforeMountAppSync

      /**
       * Temporary workaround until `cumulative` is implemented for `onBeforeMountApp`.
       *
       * See https://github.com/vikejs/vike-vue/pull/65#discussion_r1449227587
       */
      onBeforeMountAppVueQuery?: OnBeforeMountAppSync
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
    configurable: true
  })
declare global {
  var __name: typeof globalName
}
globalThis.__name = globalName
