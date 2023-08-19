import type { Config } from 'vike-vue/types'
import logoUrl from '../assets/logo.svg'
import Layout from '../layouts/LayoutDefault.vue'
import vikeVue from 'vike-vue'

// Default configs (can be overridden by pages)
export default {
  // <title>
  title: 'My Vike + React App',
  // <meta name="description">
  description: 'Demo showcasing Vike + React',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl,
  extends: vikeVue
} satisfies Config
