export { Head }

import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { noop } from '../../utils/noop.js'

/**
 * Add arbitrary `<head>` tags.
 *
 * (The children are added to `<head>`.)
 *
 * https://vike.dev/Head
 */
const Head = defineComponent({
  name: 'Head',
  inheritAttrs: false,
  setup(_, { slots }) {
    if (slots.default != null) {
      const config = useConfig()
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
    return noop
  },
})
