import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault.vue'
import vikeVue from 'vike-vue/config'
import vikeVueQuery from 'vike-vue-query/config'

export default {
  Layout,
  extends: [vikeVue, vikeVueQuery],
} satisfies Config
