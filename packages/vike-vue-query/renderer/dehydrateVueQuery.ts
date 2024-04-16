import { dehydrate } from '@tanstack/vue-query'
import type { OnAfterRenderSSRAppSync } from 'vike-vue/types'

export { dehydrateVueQuery }

const dehydrateVueQuery: OnAfterRenderSSRAppSync = ({ queryClient }): ReturnType<OnAfterRenderSSRAppSync> => {
  return { vueQueryInitialState: dehydrate(queryClient!) }
}
