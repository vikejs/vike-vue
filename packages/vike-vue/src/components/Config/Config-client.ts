export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js
import { defineComponent, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { noop } from '../../utils/noop.js'
import { configsFromHook } from '../../types/Config.js'
import type { ConfigFromHook } from '../../types/Config.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = defineComponent<ConfigFromHook>(
  (props) => {
    const config = useConfig()
    watchEffect(() => {
      config(props)
    })
    return noop
  },
  {
    name: 'Config',
    inheritAttrs: false,
    props: [...configsFromHook],
  },
)
