export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js
import { defineComponent, useAttrs, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { noop } from '../../utils/noop.js'
import type { ConfigFromHook } from '../../types/Config.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = defineComponent({
  name: 'Config',
  setup() {
    const attrs: ConfigFromHook = useAttrs()
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
