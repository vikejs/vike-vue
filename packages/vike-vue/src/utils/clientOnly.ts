import { h, shallowRef, defineComponent, onBeforeMount } from 'vue'
import type { Component, SlotsType } from 'vue'

type MaybePromise<T> = T | Promise<T>
type ComponentResolved<T> = MaybePromise<T | { default: T; }>

type ClientOnlySlots = {
  fallback?: {};
  'client-only-fallback'?: {};
}

export function clientOnly<T extends Component>(
  source: ComponentResolved<T> | (() => ComponentResolved<T>),
) {
  const clientOnlyComponent = defineComponent({
    inheritAttrs: false,

    setup(_, { attrs, slots }) {
      const resolvedComp = shallowRef<T | null>(null)

      onBeforeMount(() => {
        const loader = source instanceof Function ? source : () => source
        Promise.resolve(loader())
          .then((component) => {
            resolvedComp.value = 'default' in component ? component.default : component
          })
          .catch((e) => {
            console.error('Component loading failed:', e)
            throw e
          })
      })

      const cleanSlots = (slots: ClientOnlySlots) => {
        const cleaned = { ...slots }
        if (slots[ 'client-only-fallback' ]) {
          delete cleaned['client-only-fallback']
        } else {
          delete cleaned.fallback
        }
        return cleaned
      }

      return () =>
        resolvedComp.value !== null
          ? h(resolvedComp.value, attrs, cleanSlots(slots as ClientOnlySlots))
          : slots['client-only-fallback']?.()
    },

    slots: Object as SlotsType<ClientOnlySlots>,
  })

  return clientOnlyComponent as typeof clientOnlyComponent & T
}
