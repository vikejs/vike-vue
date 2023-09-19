import type { Config } from 'vite-plugin-ssr/types'
import logoUrl from '../assets/logo.svg'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue App',
  // <meta name="description">
  description: 'Demo showcasing Vike + Vue',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl,
  extends: vikeVue
} satisfies Config
