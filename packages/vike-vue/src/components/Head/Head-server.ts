export { Head }

import { defineComponent, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'

/**
 * Add arbitrary `<head>` tags.
 *
 * (The children are added to `<head>`.)
 *
 * https://vike.dev/Head
 */
const Head = /* @__PURE__ */ defineComponent({
  name: 'Head',
  inheritAttrs: false,
  setup(_, { slots }) {
    const config = useConfig()
    watchEffect(() => {
      if (slots.default != null) {
        const els = slots.default()
        config({
          Head: () =>
            els.map((el) => ({
              ...el,
              // remove CSS scope marker (data-v-...)
              scopeId: undefined,
            })),
        })
      }
    })
    return () => undefined
  },
})
