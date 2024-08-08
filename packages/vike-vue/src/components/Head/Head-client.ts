export { Head }

// Same as ./Head-server.ts but importing useConfig-client.js
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
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
  setup: (_props, ctx) => () => {
    const config = useConfig()
    config({ Head: ctx.slots.default?.()[0] })
    return null
  },
})
