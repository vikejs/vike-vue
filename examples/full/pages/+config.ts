import vikeVue from 'vike-vue/config'
import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // <title>
  title: 'My Vike + Vue App',
  // <link rel="canonical" />
  baseCanonicalUrl: 'https://example.com',
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  // https://vike.dev/stream
  stream: true,
  // https://vike.dev/extends
  extends: vikeVue,
  bodyHtmlEnd: '<div id="bodyHtmlEnd-test"></div>',
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
