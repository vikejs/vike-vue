export { ClientOnly }

import { cloneVNode, defineComponent, onMounted, shallowRef } from 'vue'
import type { InjectionKey, SlotsType, VNode } from 'vue'

export const clientOnlySymbol: InjectionKey<boolean> = Symbol.for('nuxt:client-only')

type ClientOnlySlots = SlotsType<{
  default?: () => VNode[]
  fallback: { attrs: Record<string, any> }
  'client-only-fallback': { attrs: Record<string, any> }
}>

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  inheritAttrs: false,
  slots: {} as ClientOnlySlots,
  setup(_, { slots, attrs }) {
    const mounted = shallowRef(false)
    onMounted(() => {
      mounted.value = true
    })
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.()
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0]!, attrs)]
        }
        return vnodes
      }
      if (slots['client-only-fallback']) {
        return slots['client-only-fallback']({ attrs })
      }
      if (slots['fallback']) {
        return slots['fallback']({ attrs })
      }
    }
  },
})
