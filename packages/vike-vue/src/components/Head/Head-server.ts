export { Head }

// Same as ./Head-client.ts but importing useConfig-server.js

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { defineComponent } from 'vue'
import { removeCssScopeId } from '../../utils/removeCssScopeId.js'

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
  setup: (_props, { slots }) => {
    if (!slots.default) return () => {}
    const elements = slots.default()
    const Head = removeCssScopeId(elements)
    const config = useConfig()
    config({ Head })
    return () => {}
  },
})
