import type { Config } from 'vike/types'
import LayoutDefault from '../layouts/LayoutDefault.vue'
import HeadDefault from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue/config'

// Default configs (can be overridden by pages)
export default {
  Layout: LayoutDefault,
  Head: HeadDefault,
  // <title>
  title: 'My Vike + Vue App',
  // <link rel="canonical" />
  baseCanonicalUrl: 'https://example.com',
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  // https://vike.dev/extends
  extends: vikeVue,
  meta: {
    baseCanonicalUrl: {
      env: { server: true, client: true }
    }
  }
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      baseCanonicalUrl?: string
    }
    interface PageContext {
      config: {
        baseCanonicalUrl?: string
      }
    }
  }
}
