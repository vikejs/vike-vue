import type { Config } from 'vike/types'
import vikeVue from 'vike-vue'

// Default configs (can be overridden by pages)
export default {
  // <title>
  title: 'My Vike + Vue App',
  baseUrl: 'https://example.com',
  extends: vikeVue,
  meta: {
    baseUrl: {
      env: { server: true, client: true }
    }
  }
} satisfies Config
