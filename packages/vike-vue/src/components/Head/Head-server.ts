export { Head }

// Same as ./Head-client.ts but importing useConfig-server.js

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { defineComponent } from 'vue'

/**
 * Add arbitrary `<head>` tags.
 *
 * (The children are teleported to `<head>`.)
 *
 * https://vike.dev/Head
 */
const Head = defineComponent({
  name: 'Head',
  inheritAttrs: false,
  setup:
    (_props, { slots }) =>
    () => {
      if (!slots.default) return
      const config = useConfig()
      config({ Head: slots.default() })
      return null
    },
})
