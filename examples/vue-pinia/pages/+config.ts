import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue/config'
import vikeVuePinia from 'vike-vue-pinia/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue + Pinia App',
  extends: [vikeVue, vikeVuePinia],
} satisfies Config
