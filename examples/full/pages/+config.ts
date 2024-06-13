import type { Config } from 'vike/types'
import vikeVue from 'vike-vue/config'

// https://vike.dev/config
export default {
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
