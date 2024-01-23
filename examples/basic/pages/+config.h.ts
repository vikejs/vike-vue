import type { Config } from 'vike/types'
import vikeVue from 'vike-vue'

// Default configs (can be overridden by pages)
export default {
  // <title>
  title: 'My Vike + Vue App',
  extends: vikeVue
} satisfies Config
