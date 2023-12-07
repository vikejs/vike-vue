import type { Config, ConfigEffect, PageContext } from 'vike/types'
import type { Component } from './types'
import { Plugin } from 'vue'

// Depending on the value of `config.meta.ssr`, set other config options' `env`
// accordingly.
// See https://vike.dev/meta#modify-existing-configurations
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

export default {
  onRenderHtml: 'import:vike-vue/renderer/onRenderHtml:onRenderHtml',
  onRenderClient: 'import:vike-vue/renderer/onRenderClient:onRenderClient',

  // A page can define an onBeforeRender() hook to be run on the server, which
  // can fetch data and return it as additional page context. Typically it will
  // return the page's root Vue component's props and additional data that can
  // be used by the renderers.
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient: ['pageProps', 'title'],

  clientRouting: true,
  hydrationCanBeAborted: true,
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
    description: {
      env: { server: true }
    },
    favicon: {
      env: { server: true }
    },
    lang: {
      env: { server: true }
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
    }
  }
} satisfies Config

type VuePluginWithOptions = {
  plugin: Plugin
  options?: any
}

// We purposely define the ConfigVikeVue interface in this file: that way we ensure it's always applied whenever the user `import vikeVue from 'vike-vue'`
declare global {
  namespace VikePackages {
    interface ConfigVikeVue {
      /** Vue component rendered and appended into &lt;head>&lt;/head> */
      Head?: Component

      Layout?: Component

      /** &lt;title>${title}&lt;/title> */
      title?: string | ((pageContext: PageContext) => string)

      /** &lt;meta name="description" content="${description}" /> */
      description?: string

      /** &lt;link rel="icon" href="${favicon}" /> */
      favicon?: string

      /** &lt;html lang="${lang}">
       *
       *  @default 'en'
       *
       */
      lang?: string

      /**
       * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
       * page's HTML will be rendered at build-time or request-time.
       * If false, render mode is SPA. In other words, the page will only be
       * rendered in the browser.
       *
       * See https://vike.dev/render-modes
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

      /**
       * List of Vue plugins (and their respective options) to be installed with
       * `app.vue(plugin, options)`.
       *
       * See https://vuejs.org/guide/reusability/plugins.html
       *
       * @default []
       *
       */
      vuePlugins?: VuePluginWithOptions[]

      /** The page's root Vue component */
      Page?: Component
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
