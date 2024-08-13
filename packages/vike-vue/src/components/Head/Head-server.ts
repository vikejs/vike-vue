export { Head }

import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { noop } from '../../utils/noop.js'
import { extractUnstyledChildren } from '../../utils/extractUnstyledChildren.js'

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
    const Head = extractUnstyledChildren(slots.default)
    if (Head) {
      const config = useConfig()
      config({ Head })
    }
    return noop
  },
})
