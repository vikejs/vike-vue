import type { Config } from 'vike/types'
import logoUrl from '../assets/logo.svg'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue'
import vikePinia from 'vike-pinia'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue + Pinia App',
  // <meta name="description">
  description: 'Demo showcasing Vike + Vue + Pinia',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl,
  extends: [vikeVue, vikePinia]
} satisfies Config
