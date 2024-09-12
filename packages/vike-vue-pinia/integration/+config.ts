import type { Pinia, StateTree } from 'pinia'
import type { Config } from 'vike/types'
import type _ from 'vike-vue/config' // Needed for declaration merging of Config

export default {
  name: 'vike-vue-pinia',
  require: {
    'vike-vue': '>=0.7.0',
  },
  onCreateApp: 'import:vike-vue-pinia/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-pinia/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderClient: 'import:vike-vue-pinia/__internal/integration/hydratePinia:hydratePinia',
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
      // @ts-expect-error TODO: fix type mismatch
      fromHtmlRenderer: {
        piniaInitialState?: StateTree
      }
    }
  }
}
