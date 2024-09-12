export { config as default }

import type { Pinia, StateTree } from 'pinia'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

const config = {
  name: 'vike-vue-pinia',
  require: {
    'vike-vue': '^0.7.0 || ^0.8.0',
  },
  passToClient: ['_piniaInitialState'],
  onCreateApp: 'import:vike-vue-pinia/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-pinia/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderClient: 'import:vike-vue-pinia/__internal/integration/onBeforeRenderClient:onBeforeRenderClient',
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
      _piniaInitialState?: StateTree
    }
  }
}
