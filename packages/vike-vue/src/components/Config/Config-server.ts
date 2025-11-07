export { Config }

import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { noop } from '../../utils/noop.js'
import { configsFromHook } from '../../types/Config.js'
import type { ConfigViaHook } from '../../types/Config.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = defineComponent<ConfigViaHook>(
  (props) => {
    const config = useConfig()
    config({ ...props, Head: () => props.Head })
    return noop
  },
  {
    name: 'Config',
    inheritAttrs: false,
    props: [...configsFromHook],
  },
)
