import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue/config'
import vikeVueQuery from 'vike-vue-query/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue + TanStack Query App',

  extends: [vikeVue, vikeVueQuery],
} satisfies Config
