import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import Head from '../layouts/HeadDefault.vue'
import vikeVue from 'vike-vue/config'
import vikeVueQuery from 'vike-vue-query'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + Vue + TanStack Query App',
  // set query client options - e.g. not refetching when window loses or gains focus during development
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD
      }
    }
  },
  extends: [vikeVue, vikeVueQuery]
} satisfies Config
