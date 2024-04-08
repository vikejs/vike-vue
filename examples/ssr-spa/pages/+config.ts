import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue App',
  ssr: true, // can be removed since `true` is the default
  extends: vikeVue,
} satisfies Config
