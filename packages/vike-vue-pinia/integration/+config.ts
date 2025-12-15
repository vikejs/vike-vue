export { config as default }

import type { Pinia, StateTree } from 'pinia'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

const config = {
  name: 'vike-vue-pinia',
  require: {
    vike: '>=0.4.249',
    'vike-vue': '>=0.7.0',
  },
  passToClient: ['_piniaInitialState'],
  onCreateApp: 'import:vike-vue-pinia/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-pinia/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onCreatePageContext: 'import:vike-vue-pinia/__internal/integration/onCreatePageContext:onCreatePageContext',
  meta: {
    onCreatePinia: {
      env: { client: true, server: true },
      cumulative: true,
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
      _piniaInitialState?: StateTree
    }
    interface GlobalContext {
      pinia?: Pinia
    }
    interface Config {
      /**
       * Hook called after creating the Pinia instance.
       *
       * Use this to register Pinia plugins.
       */
      onCreatePinia?: (pageContext: PageContext) => void | Promise<void>
    }
    interface ConfigResolved {
      onCreatePinia?: Array<(pageContext: PageContext) => void | Promise<void>>
    }
  }
}
