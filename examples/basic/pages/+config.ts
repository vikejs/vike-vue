import type { Config } from 'vike/types'
import vikeVue from 'vike-vue/config'

// Default configs (can be overridden by pages)
export default {
  // <title>
  title: 'My Vike + Vue App',
  // <link rel="canonical" />
  baseCanonicalUrl: 'https://example.com',
  extends: vikeVue,
  meta: {
    baseCanonicalUrl: {
      env: { server: true, client: true },
    },
  },
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
