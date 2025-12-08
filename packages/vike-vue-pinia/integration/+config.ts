export { config as default }

import type { Pinia, PiniaPlugin, StateTree } from 'pinia'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

const config = {
  name: 'vike-vue-pinia',
  require: {
    'vike-vue': '>=0.7.0',
  },
  passToClient: ['_piniaInitialState'],
  onCreateApp: 'import:vike-vue-pinia/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-pinia/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onCreatePageContext: 'import:vike-vue-pinia/__internal/integration/onCreatePageContext:onCreatePageContext',
  meta: {
    piniaPlugins: {
      env: { client: true },
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
      piniaPlugins?: PiniaPlugin[]
    }
    interface ConfigResolved {
      piniaPlugins?: PiniaPlugin[]
    }
  }
}
