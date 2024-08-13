export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js
import { defineComponent, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { noop } from '../../utils/noop.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = defineComponent({
  name: 'Config',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const config = useConfig()
    watchEffect(() => {
      config({
        ...attrs,
        // we ignore a Head attribute and the default slot on client side
        Head: undefined,
      })
    })
    return noop
  },
})
